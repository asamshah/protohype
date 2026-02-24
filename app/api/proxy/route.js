import { NextResponse } from 'next/server';
import https from 'https';
import http from 'http';

function fetchWithNode(url, { raw = false } = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/604.1',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'identity',
        },
        rejectUnauthorized: false,
        timeout: 15000,
      },
      (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = new URL(res.headers.location, url).href;
          fetchWithNode(redirectUrl, { raw }).then(resolve).catch(reject);
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            buffer,
            body: raw ? null : buffer.toString('utf-8'),
          });
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

function isHtmlContent(contentType) {
  return contentType && (
    contentType.includes('text/html') ||
    contentType.includes('application/xhtml+xml')
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  try {
    const parsed = new URL(targetUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const contentType = (searchParams.get('_ct') || '').toLowerCase();
    const isExpectedHtml = !contentType || contentType === 'html';

    // For non-HTML requests (JS fetch/XHR calls), return raw binary response
    const res = await fetchWithNode(targetUrl, { raw: !isExpectedHtml });
    const resContentType = res.headers['content-type'] || 'text/html';

    // Non-HTML content: pass through without modification
    if (!isHtmlContent(resContentType)) {
      return new NextResponse(res.buffer, {
        status: res.status,
        headers: {
          'Content-Type': resContentType,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'Cache-Control': 'public, max-age=60',
        },
      });
    }

    // HTML content: inject base tag, nav script, and fetch/XHR interceptors
    let body = res.buffer.toString('utf-8');

    // Inject <base> tag so relative URLs resolve to the original site
    const base = new URL(targetUrl);
    const baseHref = `<base href="${base.origin}${base.pathname.replace(/\/[^/]*$/, '/')}">`;

    // Script to intercept link clicks, fetch, and XHR to route through proxy
    // Script to intercept link clicks, fetch, and XHR to route through proxy
    const navScript = `<script>
      (function() {
        var proxyOrigin = window.location.origin;
        var proxyBase = proxyOrigin + '/api/proxy?url=';

        // --- Link click interception ---
        document.addEventListener('click', function(e) {
          var link = e.target.closest('a');
          if (!link || !link.href) return;
          try {
            var url = new URL(link.href);
            if (url.origin !== window.location.origin && (url.protocol === 'http:' || url.protocol === 'https:')) {
              e.preventDefault();
              e.stopPropagation();
              window.location.href = proxyBase + encodeURIComponent(url.href);
            }
          } catch(err) {}
        }, true);

        // --- Fetch interception ---
        var origFetch = window.fetch;
        window.fetch = function(input, init) {
          try {
            var url;
            if (input instanceof Request) {
              url = input.url;
            } else {
              url = String(input);
            }
            var parsed = new URL(url, document.baseURI);
            if (parsed.origin !== proxyOrigin && (parsed.protocol === 'http:' || parsed.protocol === 'https:')) {
              var proxied = proxyBase + encodeURIComponent(parsed.href) + '&_ct=api';
              if (input instanceof Request) {
                return origFetch.call(this, proxied, init || {});
              }
              return origFetch.call(this, proxied, init);
            }
          } catch(e) {}
          return origFetch.apply(this, arguments);
        };

        // --- XHR interception ---
        var origXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
          try {
            var parsed = new URL(url, document.baseURI);
            if (parsed.origin !== proxyOrigin && (parsed.protocol === 'http:' || parsed.protocol === 'https:')) {
              arguments[1] = proxyBase + encodeURIComponent(parsed.href) + '&_ct=api';
            }
          } catch(e) {}
          return origXHROpen.apply(this, arguments);
        };
      })();
    </script>`;

    // Remove Content-Security-Policy meta tags (including report-only)
    body = body.replace(/<meta[^>]*http-equiv\s*=\s*["']?Content-Security-Policy(?:-Report-Only)?["']?[^>]*>/gi, '');

    // Strip integrity and crossorigin attributes from script/link tags
    body = body.replace(/\s+integrity\s*=\s*["'][^"']*["']/gi, '');
    body = body.replace(/\s+crossorigin(?:\s*=\s*["'][^"']*["'])?/gi, '');

    // Inject base tag into head
    if (body.includes('<head>')) {
      body = body.replace('<head>', `<head>${baseHref}${navScript}`);
    } else if (body.includes('<head ')) {
      body = body.replace(/<head\s[^>]*>/, (match) => `${match}${baseHref}${navScript}`);
    } else if (body.includes('<HEAD>')) {
      body = body.replace('<HEAD>', `<HEAD>${baseHref}${navScript}`);
    } else {
      body = `${baseHref}${navScript}${body}`;
    }

    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': resContentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'public, max-age=60',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; img-src * data: blob:; media-src * data: blob:; font-src * data:;",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch the page', details: err.message },
      { status: 502 }
    );
  }
}
