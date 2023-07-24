async function getBase64FromBlob(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64 = reader.result;
      if (typeof base64 === 'string') {
        resolve(base64);
      } else {
        reject(new Error('Failed to read blob as base64'));
      }
    };
    reader.onerror = function () {
      reject(new Error('Failed to read blob as base64'));
    };
    reader.readAsDataURL(blob);
  });
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject('some error');
    img.src = url;
  });
}

/**
 * create offscreenCanvas from file
 * @param base64
 * @returns
 */

export async function offscreenCanvasFromFile(file: File): Promise<OffscreenCanvas> {
  const url = URL.createObjectURL(file);

  const img = await loadImage(url);

  const offscreenCanvas = new OffscreenCanvas(img.width, img.height);
  const ctx = offscreenCanvas.getContext('2d');

  ctx?.drawImage(img, 0, 0, img.width, img.height);

  URL.revokeObjectURL(url);

  return offscreenCanvas;
}

/**
 * create offscreenCanvas of base64
 * @param base64
 * @returns
 */
export async function offscreenCanvasFromBase64(base64: string, raw = false) {
  const header = raw ? '' : 'data:image/png;base64,';

  const img = await loadImage(header + base64);
  // 新しいOffscreenCanvasを作成します
  const offscreenCanvas = new OffscreenCanvas(img.width, img.height);
  const ctx = offscreenCanvas.getContext('2d');
  // OffscreenCanvasに画像を描画します
  ctx?.drawImage(img, 0, 0, img.width, img.height);

  return offscreenCanvas;
}

/**
 * Converts an image buffer to base64
 *
 * @param {OffscreenCanvas} image offscreenCanvas to convert to base64
 * @param {boolean} raw if true, returns the raw base64 string, if false, returns a data url with the base64 string
 * @returns {Promise<string>} base64 encoded image
 */
export async function toBase64(image: OffscreenCanvas, raw = true): Promise<string> {
  const header = raw ? '' : 'data:image/png;base64,';
  const blob = raw
    ? await image.convertToBlob({ type: 'image/png' })
    : await image.convertToBlob({ type: 'image/png' });
  const base64 = await getBase64FromBlob(blob);
  return header + base64;
}
