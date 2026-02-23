'use client';

import { useCallback } from 'react';

export default function useScreenshot(previewRef, { onCaptureStart, onCaptureEnd } = {}) {
  const takeScreenshot = useCallback(async () => {
    if (!previewRef?.current) return;

    try {
      // Hide UI overlays before capture
      if (onCaptureStart) onCaptureStart();

      // Small delay to let React re-render and hide the toolbar
      await new Promise((r) => setTimeout(r, 100));

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        preferCurrentTab: true,
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.muted = true;
      await video.play();

      await new Promise((r) => requestAnimationFrame(r));

      const rect = previewRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const canvas = document.createElement('canvas');
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        video,
        Math.round(rect.left * dpr),
        Math.round(rect.top * dpr),
        Math.round(rect.width * dpr),
        Math.round(rect.height * dpr),
        0,
        0,
        canvas.width,
        canvas.height
      );

      stream.getTracks().forEach((t) => t.stop());

      const link = document.createElement('a');
      link.download = 'mockframe-screenshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      if (err.name !== 'NotAllowedError') {
        console.error('Screenshot failed:', err);
      }
    } finally {
      if (onCaptureEnd) onCaptureEnd();
    }
  }, [previewRef, onCaptureStart, onCaptureEnd]);

  return { takeScreenshot };
}
