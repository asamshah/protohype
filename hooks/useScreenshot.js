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

      // Wait until the video stream is producing frames at a known resolution
      await new Promise((resolve) => {
        const check = () => {
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            resolve();
          } else {
            requestAnimationFrame(check);
          }
        };
        requestAnimationFrame(check);
      });

      const rect = previewRef.current.getBoundingClientRect();

      // Use actual video dimensions to compute the ratio (getDisplayMedia
      // does NOT necessarily capture at window.devicePixelRatio resolution)
      const srcW = video.videoWidth;
      const srcH = video.videoHeight;
      const ratioX = srcW / window.innerWidth;
      const ratioY = srcH / window.innerHeight;

      const cropX = Math.round(rect.left * ratioX);
      const cropY = Math.round(rect.top * ratioY);
      const cropW = Math.round(rect.width * ratioX);
      const cropH = Math.round(rect.height * ratioY);

      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

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
