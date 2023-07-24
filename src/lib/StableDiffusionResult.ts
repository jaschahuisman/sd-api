import { AxiosApiRawResponse as StableDiffusionApiRawResponse } from '../types';
import sharp from 'sharp';
import { offscreenCanvasFromBase64, toBase64 } from '../utils/offscreen-canvas-util';

/**
 * @class StableDiffusionResult
 * @classdesc Result of a Stable Diffusion image processing API call
 * @param {StableDiffusionApiRawResponse} Raw axios response
 * @property {OffscreenCanvas} image - First sharp image from the result list
 * @property {OffscreenCanvas[]} images - List of sharp images
 * @property {any} info - Info object
 * @property {any} parameters - Parameters object
 * @property {AxiosApiRawResponse} response - Raw response from the API
 * @example
 * const api = new StableDiffusionApi()
 * const result = await api.txt2img({
 *   prompt: "The brain of a computer",
 * })
 *
 * // Save the first image
 * result.image.toFile("result.png")
 *
 * // Save all images
 * result.images.map((image, i) => {
 *   image.toFile(`result_${i}.png`)
 * })
 */
export default class StableDiffusionResult {
  images: OffscreenCanvas[] = [];
  info: any;
  parameters: any;

  private constructor() {
    return;
  }
  private async initialize(response: StableDiffusionApiRawResponse) {
    if (response.data.image && typeof response.data.image === 'string') {
      await this.addImage(response.data.image);
    }

    if (response.data.images && Array.isArray(response.data.images)) {
      await Promise.all(response.data.images.map(image => this.addImage(image)));
    }

    this.info = response.data.info || response.data.html_info || {};
    this.parameters = response.data.parameters || {};
  }
  public static async create(response: StableDiffusionApiRawResponse) {
    const ret = new StableDiffusionResult();
    await ret.initialize(response);
    console.log(ret.images.length);
    console.log(ret.info);
    console.log(ret.images[0].width);
    return ret;
  }

  private addImage = async (image: string) => {
    const canvasImage = await offscreenCanvasFromBase64(image);
    this.images.push(canvasImage);
    console.log(this.images.length);
  };

  /**
   * First offscreenCanvas image from the result list, or undefined if no images
   * @returns {offscreenCanvas} First sharp image from the result list
   */
  public get image(): OffscreenCanvas {
    return this.images[0];
  }
}
