import { ControlNetDetectOptions } from "../types";
import { toBase64 } from "../utils/base64";
import StableDiffusionResult from "./StableDiffusionResult";
import { StableDiffusionApi } from "./StableDiffusionApi";

/**
 * @class ControlNetApi
 * @classdesc ControlNet API, a translation layer for Mikubill's ControlNet API
 * @param {StableDiffusionApi} Stable Diffusion parent API
 */
export class ControlNetApi {
  constructor(private sd: StableDiffusionApi) {}

  /**
   * Uses the selected ControlNet proprocessor module to predict a detection
   * on the input image
   * @param {ControlNetDetectOptions} options
   * @returns {Promise<StableDiffusionResult>} ApiResult with the detection result
   * @example
   * const api = new StableDiffusionApi();
   * const image = sharp("image.png");
   *
   * const result = await api.controlnet.detect({
   *   controlnet_input_images: [image],
   *   controlnet_module: "depth",
   *   controlnet_processor_res: 512,
   *   controlnet_threshold_a: 64,
   *   controlnet_threshold_b: 64,
   * });
   *
   * result.image.toFile("result.png");
   */
  public async detect(
    options: ControlNetDetectOptions
  ): Promise<StableDiffusionResult> {
    const input_images = await Promise.all(
      options.controlnet_input_images.map(
        async (image) => await toBase64(image)
      )
    );

    const response = await this.sd.api.post("/controlnet/detect", {
      controlnet_module: options.controlnet_module ?? "none",
      controlnet_input_images: input_images,
      controlnet_processor_res: options.controlnet_processor_res ?? 512,
      controlnet_threshold_a: options.controlnet_threshold_a ?? 64,
      controlnet_threshold_b: options.controlnet_threshold_b ?? 64,
    });
    return new StableDiffusionResult(response);
  }

  /**
   * Returns a list of available ControlNet models
   * @returns {Promise<string[]>} List of available ControlNet models
   */
  public async getModels(): Promise<string[]> {
    const response = await this.sd.api.get<{ model_list: string[] }>(
      "/controlnet/model_list"
    );
    return response.data.model_list;
  }

  /**
   * Returns a list of available ControlNet modules
   * @returns {Promise<string[]>} List of available ControlNet modules
   */
  public async getModules(): Promise<string[]> {
    const response = await this.sd.api.get<{ module_list: string[] }>(
      "/controlnet/module_list"
    );
    return response.data.module_list;
  }
}
