import { AxiosApiRawResponse as StableDiffusionApiRawResponse } from "../types";
import sharp from "sharp";

/**
 * @class StableDiffusionResult
 * @classdesc Result of a Stable Diffusion image processing API call
 * @param {StableDiffusionApiRawResponse} Raw axios response
 * @property {sharp.Sharp} image - First sharp image from the result list
 * @property {sharp.Sharp[]} images - List of sharp images
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
  images: sharp.Sharp[] = [];
  info: any;
  parameters: any;

  constructor(public response: StableDiffusionApiRawResponse) {
    if (response.data.image && typeof response.data.image === "string") {
      this.addImage(response.data.image);
    }

    if (response.data.images && Array.isArray(response.data.images)) {
      response.data.images.forEach(this.addImage);
    }

    this.info = response.data.info || response.data.html_info || {};
    this.parameters = response.data.parameters || {};
  }

  private addImage = (image: string) => {
    const imageBuffer = Buffer.from(image, "base64");
    const sharpImage = sharp(imageBuffer);
    this.images.push(sharpImage);
  };

  /**
   * First sharp image from the result list, or undefined if no images
   * @returns {sharp.Sharp} First sharp image from the result list
   */
  public get image(): sharp.Sharp {
    return this.images[0];
  }
}
