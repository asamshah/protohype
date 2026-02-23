import { NextResponse } from 'next/server';
import https from 'https';
import http from 'http';

function fetchWithNode(url) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === 'https:' ? https : http;

    const req = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
          fetchWithNode(redirectUrl).then(resolve).catch(reject);
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf-8'),
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
    const res = await fetchWithNode(targetUrl);
    const contentType = res.headers['content-type'] || 'text/html';
    let body = res.body;

    // Inject <base> tag so relative URLs resolve to the original site
    const base = new URL(targetUrl);
    const baseHref = `<base href="${base.origin}${base.pathname.replace(/\/[^/]*$/, '/')}">`;

    if (body.includes('<head>')) {
      body = body.replace('<head>', `<head>${baseHref}`);
    } else if (body.includes('<head ')) {
      body = body.replace(/<head\s[^>]*>/, (match) => `${match}${baseHref}`);
    } else if (body.includes('<HEAD>')) {
      body = body.replace('<HEAD>', `<HEAD>${baseHref}`);
    } else {
      body = `${baseHref}${body}`;
    }

    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch the page', details: err.message },
      { status: 502 }
    );
  }
}
