import sharp, { type Sharp } from "sharp";
import { type SdResultInfo, type SdResultParameters } from "../../types";
import { AxiosResponse } from "axios";

export default class SdResult {
  public images: Sharp[] = [];
  public info: SdResultInfo = {};
  public parameters: SdResultParameters = {};

  constructor(public rawResponse: AxiosResponse) {
    if (rawResponse.status !== 200) {
      throw new Error(
        `Invalid Stable Diffusion response status: ${rawResponse.status}`
      );
    }

    const { data } = rawResponse;

    if (!data) {
      throw new Error("Invalid Stable Diffusion response data");
    }

    const { info, parameters, image, images } = data;

    this.info = info;
    this.parameters = parameters;

    if (image && typeof image === "string") {
      this.addImage(image);
    }

    if (images && Array.isArray(images)) {
      images.forEach((image) => {
        if (typeof image === "string") {
          this.addImage(image);
        }
      });
    }
  }

  private addImage = (image: string) => {
    const sharpImage = sharp(Buffer.from(image, "base64"));
    this.images.push(sharpImage);
  };

  public get image() {
    return this.images[0];
  }
}
