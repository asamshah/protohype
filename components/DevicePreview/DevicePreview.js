'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import styles from './DevicePreview.module.css';

export default function DevicePreview({ url, device, background, previewRef, includeFrame = true }) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [iframeError, setIframeError] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDesktop = device?.category === 'desktop';
  const bezel = device?.bezel || 12;

  const frameWidth = includeFrame ? (device?.width || 390) + bezel * 2 : (device?.width || 390);
  const frameHeight = includeFrame ? (device?.height || 844) + bezel * 2 : (device?.height || 844);
  const totalHeight = isDesktop && includeFrame ? frameHeight + 30 : frameHeight;

  const calculateScale = useCallback(() => {
    if (!containerRef.current || !device) return;
    const container = containerRef.current;
    const maxW = container.clientWidth * 0.8;
    const maxH = container.clientHeight * 0.85;
    const scaleX = maxW / frameWidth;
    const scaleY = maxH / totalHeight;
    setScale(Math.min(scaleX, scaleY, 1));
  }, [device, frameWidth, totalHeight]);

  useEffect(() => {
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [calculateScale]);

  useEffect(() => {
    if (url) {
      setLoading(true);
      setIframeError(false);
    }
  }, [url]);

  const proxyUrl = url ? `/api/proxy?url=${encodeURIComponent(url)}` : '';

  function getBackgroundStyle() {
    if (!background || background === 'transparent') {
      return {
        background: 'repeating-conic-gradient(#1a1a1e 0% 25%, #111113 0% 50%) 50% / 20px 20px',
      };
    }
    return { background };
  }

  function renderSideButtons() {
    if (!device || isDesktop || !includeFrame) return null;
    const sb = device.sideButtons;
    if (sb === 'iphone' || sb === 'iphone-action') {
      return (
        <>
          <div className={styles.sideBtn} style={{
            left: -3, top: bezel + 100, width: 3, height: 32,
            borderRadius: '3px 0 0 3px', background: device.frameColor,
            boxShadow: '-1px 0 2px rgba(0,0,0,0.4)',
          }} />
          <div className={styles.sideBtn} style={{
            left: -3, top: bezel + 142, width: 3, height: 32,
            borderRadius: '3px 0 0 3px', background: device.frameColor,
            boxShadow: '-1px 0 2px rgba(0,0,0,0.4)',
          }} />
          <div className={styles.sideBtn} style={{
            left: -3, top: bezel + 60, width: 3, height: sb === 'iphone-action' ? 16 : 22,
            borderRadius: '3px 0 0 3px', background: device.frameColor,
            boxShadow: '-1px 0 2px rgba(0,0,0,0.4)',
          }} />
          <div className={styles.sideBtn} style={{
            right: -3, top: bezel + 100, width: 3, height: 48,
            borderRadius: '0 3px 3px 0', background: device.frameColor,
            boxShadow: '1px 0 2px rgba(0,0,0,0.4)',
          }} />
        </>
      );
    }
    if (sb === 'android' || sb === 'pixel') {
      return (
        <>
          <div className={styles.sideBtn} style={{
            right: -3, top: bezel + 80, width: 3, height: 52,
            borderRadius: '0 3px 3px 0', background: device.frameColor,
            boxShadow: '1px 0 2px rgba(0,0,0,0.4)',
          }} />
          <div className={styles.sideBtn} style={{
            right: -3, top: bezel + 145, width: 3, height: 32,
            borderRadius: '0 3px 3px 0', background: device.frameColor,
            boxShadow: '1px 0 2px rgba(0,0,0,0.4)',
          }} />
        </>
      );
    }
    if (sb === 'ipad') {
      return (
        <>
          <div className={styles.sideBtn} style={{
            top: -3, right: bezel + 30, height: 3, width: 40,
            borderRadius: '3px 3px 0 0', background: device.frameColor,
            boxShadow: '0 -1px 2px rgba(0,0,0,0.4)',
          }} />
          <div className={styles.sideBtn} style={{
            right: -3, top: bezel + 50, width: 3, height: 36,
            borderRadius: '0 3px 3px 0', background: device.frameColor,
            boxShadow: '1px 0 2px rgba(0,0,0,0.4)',
          }} />
          <div className={styles.sideBtn} style={{
            right: -3, top: bezel + 96, width: 3, height: 36,
            borderRadius: '0 3px 3px 0', background: device.frameColor,
            boxShadow: '1px 0 2px rgba(0,0,0,0.4)',
          }} />
        </>
      );
    }
    return null;
  }

  function renderNotch() {
    if (!device || !includeFrame) return null;
    switch (device.notch) {
      case 'dynamic-island':
        return (
          <div className={styles.dynamicIsland} style={{ top: bezel + 12 }}>
            <div className={styles.diCamera} />
          </div>
        );
      case 'notch':
        return (
          <div className={styles.notch} style={{ top: bezel }}>
            <div className={styles.notchSpeaker} />
            <div className={styles.notchCamera} />
          </div>
        );
      case 'punch-hole':
        return (
          <div className={styles.punchHole} style={{ top: bezel + 10 }} />
        );
      case 'macbook-notch':
        return (
          <div className={styles.macNotch} style={{ top: 0 }}>
            <div className={styles.macCamera} />
          </div>
        );
      default:
        return null;
    }
  }

  function renderFoldHinge() {
    if (!device?.fold || !includeFrame) return null;
    return <div className={styles.foldHinge} />;
  }

  // Frame-less mode: just show the screen with rounded corners
  if (!includeFrame && url) {
    return (
      <div className={styles.container}
        ref={(el) => { containerRef.current = el; if (previewRef) previewRef.current = el; }}
        style={getBackgroundStyle()}
      >
        <div className={styles.deviceWrapper} style={{ transform: `scale(${scale})` }}>
          <div
            className={styles.screenOnly}
            style={{
              width: device.width,
              height: device.height,
              borderRadius: device.screenRadius,
            }}
          >
            {loading && (
              <div className={styles.loader}>
                <div className={styles.spinner} />
                <span>Loading...</span>
              </div>
            )}
            {iframeError && (
              <div className={styles.errorOverlay}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <p>Cannot load this site</p>
              </div>
            )}
            <iframe
              src={proxyUrl}
              className={styles.iframe}
              style={{ opacity: loading || iframeError ? 0 : 1 }}
              title="Device preview"
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setIframeError(true); }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}
      ref={(el) => { containerRef.current = el; if (previewRef) previewRef.current = el; }}
      style={getBackgroundStyle()}
    >
      {!url ? (
        <div className={styles.emptyState}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: 12 }}>
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" />
          </svg>
          <h2>Enter a URL to preview</h2>
          <p>The site loads inside the selected device frame</p>
        </div>
      ) : (
        <div className={styles.deviceWrapper} style={{ transform: `scale(${scale})` }}>
          <div
            className={`${styles.frame} ${isDesktop ? styles.desktopFrame : ''}`}
            style={{
              width: frameWidth,
              height: frameHeight,
              borderRadius: device.frameRadius,
              background: device.frameColor,
              ...(isDesktop ? { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 } : {}),
            }}
          >
            <div className={styles.bezelShine} style={{ borderRadius: device.frameRadius }} />

            {renderSideButtons()}
            {renderNotch()}
            {renderFoldHinge()}

            <div
              className={styles.screen}
              style={{
                width: device.width,
                height: device.height,
                borderRadius: device.screenRadius,
                top: bezel,
                left: bezel,
              }}
            >
              {loading && (
                <div className={styles.loader}>
                  <div className={styles.spinner} />
                  <span>Loading...</span>
                </div>
              )}
              {iframeError && (
                <div className={styles.errorOverlay}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                  <p>Cannot load this site</p>
                  <span>The site may block embedding</span>
                </div>
              )}
              <iframe
                src={proxyUrl}
                className={styles.iframe}
                style={{ opacity: loading || iframeError ? 0 : 1 }}
                title="Device preview"
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setIframeError(true); }}
              />
            </div>

            {!isDesktop && device.notch !== 'none' && (
              <div className={styles.homeIndicator} style={{ bottom: bezel + 4 }} />
            )}
          </div>

          {isDesktop && (
            <div className={styles.laptopBase} style={{
              width: frameWidth + 80,
              background: device.frameColor,
            }}>
              <div className={styles.laptopNotch} />
              <div className={styles.laptopBottom} style={{ background: device.frameColor }} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
