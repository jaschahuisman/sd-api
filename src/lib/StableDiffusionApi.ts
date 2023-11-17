import {
  type ExtraBatchOptions,
  type ExtraSingleOptions,
  type ApiRawResponse,
  type Img2ImgOptions,
  type StableDiffusionApiConfig,
  type Txt2ImgOptions,
  type PromptStyle,
  type RealESRGanModel,
  type FaceRestorer,
  type HyperNetwork,
  type StableDiffusionModel,
  type Upscaler,
  type Sampler,
  type Progress,
} from "../types";
import { type Sharp } from "sharp";

import axios from "axios";
import stringSimilarity from "string-similarity";

import StableDiffusionResult from "./StableDiffusionResult";
import { ControlNetApi } from "./ControlNetApi";
import { toBase64 } from "../utils/base64";
import { ControlNetUnit } from "./ControlNetUnit";

const createScriptsWithCnUnits = async (
  initScripts: {} | undefined,
  controlNetUnit: ControlNetUnit[]
) => {
  const promises = controlNetUnit.map(async (unit) => await unit.toJson());
  const args = await Promise.all(promises);
  const ControlNet = { args };
  const scripts = { ...initScripts, ControlNet };
  return scripts;
};

/**
 * @class StableDiffusionApi
 * @classdesc Stable Diffusion API, a translation layer for [Automatic1111's Stable Diffusion API](https://github.com/AUTOMATIC1111/stable-diffusion-webui)
 * @param {StableDiffusionApiConfig} config - Configuration object
 * @property {StableDiffusionApiConfig} config - Configuration object
 * @property {axios.AxiosInstance} api - Axios instance
 * @property {ControlNetApi} controlNet - ControlNet API
 * @example
 * const api = new StableDiffusionApi()
 * const result = await api.txt2img({
 *   prompt: "A computer that has more brain power than a human being",
 *   batch_size: 2,
 * })
 *
 * // Save the first image
 * result.image.toFile("result.png")
 *
 * // Save all images
 * result.images.forEach((image, i) => {
 *   image.toFile(`result_${i}.png`)
 * })
 */
export class StableDiffusionApi {
  config;
  api;

  public constructor({
    host = "127.0.0.1",
    port = 7860,
    protocol = "http",
    timeout = 30000,
    baseUrl = null,
    defaultSampler = "Euler a",
    defaultStepCount = 20,
  }: StableDiffusionApiConfig | undefined = {}) {
    const baseURL = baseUrl || `${protocol}://${host}${port ? `:${port}` : ""}`;

    this.config = {
      host,
      port,
      protocol,
      timeout,
      baseUrl,
      defaultSampler,
      defaultStepCount,
    };

    this.api = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Set the authentication for the axios API
   * @param {string} username
   * @param {string} password
   * @returns {StableDiffusionApi} this StableDiffusionApi instance
   */
  public setAuth(username: string, password: string): StableDiffusionApi {
    this.api.defaults.auth = {
      username,
      password,
    };
    return this;
  }

  /**
   * Stable Diffusion txt2img call
   * @param {Txt2ImgOptions} options
   * @returns {Promise<StableDiffusionResult>} ApiResult containing the generated image(s)
   * @memberof StableDiffusionApi
   * @async
   * @example
   * const api = new StableDiffusionApi();
   * const result = await api.txt2img({
   *   prompt: "An angry artist that claims that the Stable Diffusion model contains an exact copy of their artwork",
   * });
   */
  public async txt2img(
    options: Txt2ImgOptions
  ): Promise<StableDiffusionResult> {
    const alwayson_scripts = await createScriptsWithCnUnits(
      options.alwayson_scripts,
      options.controlnet_units ?? []
    );

    const response = await this.api.post<ApiRawResponse>("/sdapi/v1/txt2img", {
      enable_hr: options.enable_hr ?? false,
      hr_scale: options.hr_scale ?? 2,
      hr_upscaler: options.hr_upscaler ?? "Latent",
      hr_second_pass_steps: options.hr_second_pass_steps ?? 0,
      hr_resize_x: options.hr_resize_x ?? 0,
      hr_resize_y: options.hr_resize_y ?? 0,
      denoising_strength: options.denoising_strength ?? 0.7,
      firstphase_width: options.firstphase_width ?? 0,
      firstphase_height: options.firstphase_height ?? 0,
      prompt: options.prompt ?? "",
      styles: options.styles ?? [],
      seed: options.seed ?? -1,
      subseed: options.subseed ?? -1,
      subseed_strength: options.subseed_strength ?? 0.0,
      seed_resize_from_h: options.seed_resize_from_h ?? 0,
      seed_resize_from_w: options.seed_resize_from_w ?? 0,
      batch_size: options.batch_size ?? 1,
      n_iter: options.n_iter ?? 1,
      steps: options.steps ?? this.config.defaultStepCount,
      cfg_scale: options.cfg_scale ?? 7.0,
      width: options.width ?? 512,
      height: options.height ?? 512,
      restore_faces: options.restore_faces ?? false,
      tiling: options.tiling ?? false,
      do_not_save_samples: options.do_not_save_samples ?? false,
      do_not_save_grid: options.do_not_save_grid ?? false,
      negative_prompt: options.negative_prompt ?? "",
      eta: options.eta ?? 1.0,
      s_churn: options.s_churn ?? 0,
      s_tmax: options.s_tmax ?? 0,
      s_tmin: options.s_tmin ?? 0,
      s_noise: options.s_noise ?? 1,
      override_settings: options.override_settings ?? {},
      override_settings_restore_afterwards:
        options.override_settings_restore_afterwards ?? true,
      script_args: options.script_args ?? [],
      script_name: options.script_name ?? null,
      send_images: options.send_images ?? true,
      save_images: options.save_images ?? false,
      alwayson_scripts,
      sampler_name: options.sampler_name ?? this.config.defaultSampler,
      use_deprecated_controlnet: options.use_deprecated_controlnet ?? false,
    });
    return new StableDiffusionResult(response);
  }

  /**
   * Stable Diffusion img2img call
   * @param {Img2ImgOptions} options Options for the img2img call
   * @returns {Promise<StableDiffusionResult>} ApiResult containing the generated image(s)
   * @memberof StableDiffusionApi
   * @async
   * @example
   * const api = new StableDiffusionApi();
   * const init_image = sharp("dog.png");
   * const result = await api.img2img({
   *   init_images: [init_image],
   *   prompt: "Just a funky disco dog",
   * });
   */
  public async img2img(
    options: Img2ImgOptions
  ): Promise<StableDiffusionResult> {
    const init_images = await Promise.all(
      options.init_images.map(async (image) => await toBase64(image))
    );

    const mask = options.mask_image ? await toBase64(options.mask_image) : null;

    const alwayson_scripts = await createScriptsWithCnUnits(
      options.alwayson_scripts,
      options.controlnet_units ?? []
    );

    const response = await this.api.post<ApiRawResponse>("/sdapi/v1/img2img", {
      init_images,
      resize_mode: options.resize_mode ?? 0,
      denoising_strength: options.denoising_strength ?? 0.75,
      image_cfg_scale: options.image_cfg_scale ?? 1.5,
      mask,
      mask_blur: options.mask_blur ?? 4,
      inpainting_fill: options.inpainting_fill ?? 0,
      inpaint_full_res: options.inpaint_full_res ?? true,
      inpaint_full_res_padding: options.inpaint_full_res_padding ?? 0,
      inpainting_mask_invert: options.inpainting_mask_invert ?? 0,
      initial_noise_multiplier: options.initial_noise_multiplier ?? 1,
      prompt: options.prompt ?? "",
      styles: options.styles ?? [],
      seed: options.seed ?? -1,
      subseed: options.subseed ?? -1,
      subseed_strength: options.subseed_strength ?? 0,
      seed_resize_from_h: options.seed_resize_from_h ?? 0,
      seed_resize_from_w: options.seed_resize_from_w ?? 0,
      sampler_name: options.sampler_name ?? this.config.defaultSampler,
      batch_size: options.batch_size ?? 1,
      n_iter: options.n_iter ?? 1,
      steps: options.steps ?? this.config.defaultStepCount,
      cfg_scale: options.cfg_scale ?? 7.0,
      width: options.width ?? 512,
      height: options.height ?? 512,
      restore_faces: options.restore_faces ?? false,
      tiling: options.tiling ?? false,
      do_not_save_samples: options.do_not_save_samples ?? false,
      do_not_save_grid: options.do_not_save_grid ?? false,
      negative_prompt: options.negative_prompt ?? "",
      eta: options.eta ?? 1.0,
      s_churn: options.s_churn ?? 0,
      s_tmax: options.s_tmax ?? 0,
      s_tmin: options.s_tmin ?? 0,
      s_noise: options.s_noise ?? 1,
      override_settings: options.override_settings ?? {},
      override_settings_restore_afterwards:
        options.override_settings_restore_afterwards ?? true,
      script_args: options.script_args ?? [],
      include_init_images: options.include_init_images ?? false,
      script_name: options.script_name ?? null,
      send_images: options.send_images ?? true,
      save_images: options.save_images ?? false,
      alwayson_scripts,
      use_deprecated_controlnet: options.use_deprecated_controlnet ?? false,
    });
    return new StableDiffusionResult(response);
  }

  /**
   * Stable Diffusion extra's call for single images
   * @param {ExtraSingleOptions} options Options for the extra's call
   * @returns {Promise<StableDiffusionResult>} ApiResult containing the generated image(s)
   * @memberof StableDiffusionApi
   * @async
   * @example
   * const api = new StableDiffusionApi();
   * const image = sharp("dog.png");
   * const result = await api.extraSingle({
   *   image,
   *   upscaler_1: "Lanczos",
   *   upscaling_resize: 2,
   * });
   */
  public async extraSingle(
    options: ExtraSingleOptions
  ): Promise<StableDiffusionResult> {
    const image = await toBase64(options.image);
    const response = await this.api.post<ApiRawResponse>(
      "/sdapi/v1/extra-single-image",
      {
        image,
        resize_mode: options.resize_mode ?? 0,
        show_extras_results: options.show_extras_results ?? true,
        gfpgan_visibility: options.gfpgan_visibility ?? 0,
        codeformer_weight: options.codeformer_weight ?? 0,
        upscaling_resize: options.upscaling_resize ?? 2,
        upscaling_resize_w: options.upscaling_resize_w ?? 512,
        upscaling_resize_h: options.upscaling_resize_h ?? 512,
        upscaling_resize_crop: options.upscaling_resize_crop ?? true,
        upscaler_1: options.upscaler_1 ?? "None",
        upscaler_2: options.upscaler_2 ?? "None",
        extras_upscaler_2_visibility: options.extras_upscaler_2_visibility ?? 0,
        upscale_first: options.upscale_first ?? false,
      }
    );
    return new StableDiffusionResult(response);
  }

  /**
   * Stable Diffusion extra's call for batch images
   * @param {ExtraBatchOptions} batchOptions Options for the extra's call
   * @returns {Promise<StableDiffusionResult>} ApiResult containing the generated image(s)
   * @memberof StableDiffusionApi
   * @async
   * @example
   * const api = new StableDiffusionApi();
   * const image1 = sharp("dog.png");
   * const image2 = sharp("cat.png");
   * const result = await api.extraBatch({
   *   images: [image1, image2],
   *   name_list: ["dog", "cat"],
   *   upscaler_1: "Lanczos",
   *   upscaling_resize: 2,
   * });
   */
  public async extraBatch(
    options: ExtraBatchOptions
  ): Promise<StableDiffusionResult> {
    if (options.images.length !== options.name_list.length) {
      throw new Error(
        "The number of images and names must be the same in extraBatch"
      );
    }

    const images = await Promise.all(
      options.images.map(async (image) => await toBase64(image))
    );

    const image_list = images.map((image, index) => {
      return {
        image,
        name: options.name_list[index],
      };
    });

    const response = await this.api.post<ApiRawResponse>(
      "/sdapi/v1/extra-batch-images",
      {
        image_list,
        resize_mode: options.resize_mode ?? 0,
        show_extras_results: options.show_extras_results ?? true,
        gfpgan_visibility: options.gfpgan_visibility ?? 0,
        codeformer_weight: options.codeformer_weight ?? 0,
        upscaling_resize: options.upscaling_resize ?? 2,
        upscaling_resize_w: options.upscaling_resize_w ?? 512,
        upscaling_resize_h: options.upscaling_resize_h ?? 512,
        upscaling_resize_crop: options.upscaling_resize_crop ?? true,
        upscaler_1: options.upscaler_1 ?? "None",
        upscaler_2: options.upscaler_2 ?? "None",
        extras_upscaler_2_visibility: options.extras_upscaler_2_visibility ?? 0,
        upscale_first: options.upscale_first ?? false,
      }
    );
    return new StableDiffusionResult(response);
  }

  /**
   * Gets the info of a png image
   * @param {Sharp} image Image to get info from
   * @returns {Promise<StableDiffusionResult>} ApiResult containing the info
   */
  public async pngInfo(image: Sharp): Promise<StableDiffusionResult> {
    const image_data = await toBase64(image);
    const response = await this.api.post<ApiRawResponse>("/sdapi/v1/png-info", {
      image: image_data,
    });
    return new StableDiffusionResult(response);
  }

  /**
   * Interrogates an image with an interrogation model
   * @param {Sharp} image Image to interrogate
   * @param model Model to use for interrogation
   * @returns {Promise<StableDiffusionResult>} The result of the interrogation
   */
  public async interrogate(
    image: Sharp,
    model: string
  ): Promise<StableDiffusionResult> {
    const image_data = await toBase64(image);
    const response = await this.api.post<ApiRawResponse>(
      "/sdapi/v1/interrogate",
      {
        image: image_data,
      }
    );
    return new StableDiffusionResult(response);
  }

  public async getOptions() {
    const response = await this.api.get("/sdapi/v1/options");
    return response.data;
  }

  public async setOptions(options: any) {
    const response = await this.api.post("/sdapi/v1/options", options);
    return response.data;
  }

  /**
   * Gets the progress status of the current session
   * @param {boolean} skipCurrentImage True to skip the current image, false to include it
   * @returns {Promise<Progress>} The progress status of the current session
   */
  public async getProgress(
    skipCurrentImage: boolean = false
  ): Promise<Progress> {
    const response = await this.api.get<Progress>(
      `/sdapi/v1/progress?skipCurrentImage=${skipCurrentImage}`
    );
    return response.data;
  }

  /**
   * Gets the list of command line flags that are available
   * @returns {Promise<Record<string, unknown>>} The list of command line flags that are available
   */
  public async getCmdFlags(): Promise<Record<string, unknown>> {
    const response = await this.api.get<Record<string, unknown>>(
      "/sdapi/v1/cmd-flags"
    );
    return response.data;
  }

  /**
   * Gets the list of samplers
   * @returns {Promise<Sampler[]>} The list of samplers
   */
  public async getSamplers(): Promise<Sampler[]> {
    const response = await this.api.get<Sampler[]>("/sdapi/v1/samplers");
    return response.data;
  }

  /**
   * Gets the list of upscalers
   * @returns {Promise<Upscaler[]>} The list of upscalers
   */
  public async getUpscalers(): Promise<Upscaler[]> {
    const response = await this.api.get<Upscaler[]>("/sdapi/v1/upscalers");
    return response.data;
  }

  /**
   * Gets the list of Stable Diffusion models
   * @returns {Promise<StableDiffusionModel[]>} The list of Stable Diffusion models
   */
  public async getSdModels(): Promise<StableDiffusionModel[]> {
    const response = await this.api.get<StableDiffusionModel[]>(
      "/sdapi/v1/sd-models"
    );
    return response.data;
  }

  /**
   * Gets the list of hypernetworks
   * @returns {Promise<HyperNetwork[]>} The list of hypernetworks
   */
  public async getHypernetworks(): Promise<HyperNetwork[]> {
    const response = await this.api.get<HyperNetwork[]>(
      "/sdapi/v1/hypernetworks"
    );
    return response.data;
  }

  /**
   * Gets the list of face restorers
   * @returns {Promise<FaceRestorer[]>} The list of face restorers
   */
  public async getFaceRestorers(): Promise<FaceRestorer[]> {
    const response = await this.api.get<FaceRestorer[]>(
      "/sdapi/v1/face-restorers"
    );
    return response.data;
  }

  /**
   * Gets the list of Real-ESRGAN models
   * @returns {Promise<RealESRGanModel[]>} The list of Real-ESRGAN models
   */
  public async getRealesrganModels(): Promise<RealESRGanModel[]> {
    const response = await this.api.get<RealESRGanModel[]>(
      "/sdapi/v1/realesrgan-models"
    );
    return response.data;
  }

  /**
   * Gets the list of Stable Diffusion prompt styles
   * @returns {Promise<PromptStyle[]>} The list of prompt styles
   */
  public async getPromptStyles(): Promise<PromptStyle[]> {
    const response = await this.api.get<PromptStyle[]>(
      "/sdapi/v1/prompt-styles"
    );
    return response.data;
  }

  /**
   * Refreshes the list of Stable Diffusion checkpoints
   * @returns {Promise<void>}
   */
  public async refreshCheckpoints(): Promise<void> {
    await this.api.post("/sdapi/v1/refresh-checkpoints");
  }

  /**
   * Gets the name of the current Stable Diffusion checkpoint being used
   * @returns {Promise<string>} The name of the current Stable Diffusion checkpoint being used
   */
  public async getCurrentModel(): Promise<string> {
    const options = await this.getOptions();
    return options.sd_model_checkpoint as string;
  }

  /**
   * Sets the Stable Diffusion checkpoint to use
   * @param name Name of the model to set.
   * @param findClosest If true, will try to find the closest model name if the exact name is not found
   * @returns {Promise<void>}
   */
  public async setModel(
    name: string,
    findClosest: boolean = true
  ): Promise<void> {
    const models = await this.getSdModels();
    const modelNames = models.map((model) => model.model_name);

    let foundModel = null;

    if (modelNames.includes(name)) {
      foundModel = name;
    } else if (findClosest) {
      const bestMatch = stringSimilarity.findBestMatch(name, modelNames);

      if (bestMatch.bestMatch.rating > 0.5) {
        foundModel = bestMatch.bestMatch.target;
      }
    }

    if (foundModel) {
      const options = {
        sd_model_checkpoint: foundModel,
      };
      await this.setOptions(options);
    } else {
      throw new Error("Model not found");
    }
  }

  /**
   * Waits for the Stable Diffusion server to be ready to accept new requests
   * @param checkInterval Interval in seconds to check progress
   * @returns {Promise<boolean>} Only resolves when progress is 0.0 and job_count is 0
   */
  public async waitForReady(checkInterval: number = 5.0): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      const interval = setInterval(async () => {
        const result = await this.getProgress();
        const progress = result.progress;
        const jobCount = result.state.job_count;

        if (progress === 0.0 && jobCount === 0) {
          clearInterval(interval);
          resolve(true);
        } else {
          console.log(
            `[WAIT]: progress = ${progress.toFixed(4)}, job_count = ${jobCount}`
          );
        }
      }, checkInterval * 1000);
    });
  }

  public ControlNet = new ControlNetApi(this);
}
