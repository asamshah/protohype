import { downloadBlob } from './capture';

export async function convertToMp4(webmBlob, onProgress) {
  try {
    if (onProgress) onProgress(10);

    const formData = new FormData();
    formData.append('video', webmBlob, 'recording.webm');

    if (onProgress) onProgress(20);

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.details || 'Server conversion failed');
    }

    if (onProgress) onProgress(80);

    const mp4Blob = await response.blob();
    downloadBlob(mp4Blob, 'mockframe-recording.mp4');

    if (onProgress) onProgress(100);
  } catch (err) {
    console.error('MP4 conversion failed:', err);
    throw err;
  }
}

export async function convertToGif(webmBlob, onProgress) {
  const videoUrl = URL.createObjectURL(webmBlob);
  const video = document.createElement('video');
  video.src = videoUrl;
  video.muted = true;

  await new Promise((resolve) => {
    video.onloadedmetadata = resolve;
  });

  const width = video.videoWidth;
  const height = video.videoHeight;
  const duration = video.duration;
  const fps = 10;
  const totalFrames = Math.min(Math.ceil(duration * fps), 300);

  const GIF = (await import('gif.js')).default;
  const gif = new GIF({
    workers: 2,
    quality: 10,
    width,
    height,
    workerScript: '/gif.worker.js',
  });

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  for (let i = 0; i < totalFrames; i++) {
    const time = i / fps;
    video.currentTime = time;
    await new Promise((resolve) => {
      video.onseeked = resolve;
    });
    ctx.drawImage(video, 0, 0, width, height);
    gif.addFrame(ctx, { copy: true, delay: 1000 / fps });
    if (onProgress) onProgress((i / totalFrames) * 80);
  }

  URL.revokeObjectURL(videoUrl);

  return new Promise((resolve) => {
    gif.on('finished', (blob) => {
      downloadBlob(blob, 'mockframe-recording.gif');
      if (onProgress) onProgress(100);
      resolve();
    });
    gif.render();
  });
}
