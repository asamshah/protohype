import html2canvas from 'html2canvas';

export async function captureElement(element, options = {}) {
  const { background = '#0a0a0b', includeFrame = true } = options;

  const canvas = await html2canvas(element, {
    backgroundColor: background === 'transparent' ? null : background,
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    ignoreElements: (el) => {
      if (!includeFrame && el.dataset?.frameElement === 'true') {
        return true;
      }
      return false;
    },
  });

  return canvas;
}

export function downloadCanvas(canvas, filename = 'mockframe-screenshot.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
