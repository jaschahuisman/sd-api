import { ControlNetUnitConfig } from "../types";
import { toBase64 } from "../utils/base64";

/**
 * @class ControlNetUnit
 * @classdesc ControlNet Unit, a translation layer for [Mikubill's ControlNet API](https://github.com/Mikubill/sd-webui-controlnet)
 * @param {ControlNetUnitConfig} config Configuration for the ControlNet Unit
 * @example
 * const api = new StableDiffusionApi();
 * const image = sharp("image.png");
 *
 * const unit = new ControlNetUnit({
 *   input_image: image,
 *   module: "depth",
 *   model: "depth",
 * });
 *
 * const result = await api.txt2img({
 *   prompt: "Someone who pretends to be a world-renowned artist, but is actually a random person who prompts text and presses buttons",
 *   init_images: [image],
 *   controlnet_units: [unit],
 * })
 *
 * result.image.toFile("result.png");
 */
export class ControlNetUnit {
  constructor(public config: ControlNetUnitConfig) {}

  async toJson() {
    const input_image = await toBase64(this.config.input_image);
    const mask = this.config.mask && (await toBase64(this.config.mask));
    return {
      input_image,
      mask,
      module: this.config.module ?? "none",
      model: this.config.model ?? "None",
      weight: this.config.weight ?? 1,
      resize_mode: this.config.resize_mode ?? "Scale to Fit (Inner Fit)",
      lowvram: this.config.lowvram ?? false,
      processor_res: this.config.processor_res ?? 64,
      threshold_a: this.config.threshold_a ?? 64,
      threshold_b: this.config.threshold_b ?? 64,
      guidance: this.config.guidance ?? 1,
      guidance_start: this.config.guidance_start ?? 0,
      guidance_end: this.config.guidance_end ?? 1,
      guessmode: this.config.guessmode ?? false,
    } as const;
  }
}
