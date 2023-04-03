import { AxiosResponse } from "axios";
import { ControlNetUnit } from "../lib/ControlNetUnit";
import { type Sharp } from "sharp";

export type SamplerName =
  | "Euler a"
  | "Euler"
  | "LMS"
  | "Heun"
  | "DPM2"
  | "DPM2 a"
  | "DPM++ 2S a"
  | "DPM++ 2M"
  | "DPM++ SDE"
  | "DPM fast"
  | "DPM adaptive"
  | "LMS Karras"
  | "DPM2 Karras"
  | "DPM2 a Karras"
  | "DPM++ 2S a Karras"
  | "DPM++ 2M Karras"
  | "DPM++ SDE Karras"
  | "DDIM"
  | "PLMS"
  | "UniPC"
  | string;

export type StableDiffusionApiConfig = {
  host?: string;
  port?: number | null;
  baseUrl?: string | null;
  timeout?: number;
  defaultSampler?: SamplerName;
  defaultStepCount?: number;
  protocol?: "http" | "https";
};

export type ApiRawResponse = {
  image?: string;
  images?: string[];
  info?: any;
  html_info?: any;
  parameters?: any;
};

export type AxiosApiRawResponse = AxiosResponse<ApiRawResponse>;

export type UpscalerName =
  | "None"
  | "Lanczos"
  | "Nearest"
  | "LDSR"
  | "BSRGAN"
  | "ESRGAN_4x"
  | "R-ESRGAN General 4xV3"
  | "ScuNET GAN"
  | "ScuNET PSNR"
  | "SwinIR 4x"
  | string;

export type HiResUpscalerName =
  | "None"
  | "Latent"
  | "Latent (antialiased)"
  | "Latent (bicubic)"
  | "Latent (bicubic antialiased)"
  | "Latent (nearist)"
  | "Latent (nearist-exact)"
  | "Lanczos"
  | "Nearest"
  | "ESRGAN_4x"
  | "LDSR"
  | "ScuNET GAN"
  | "ScuNET PSNR"
  | "SwinIR 4x"
  | string;

export type Txt2ImgOptions = {
  enable_hr?: boolean;
  hr_scale?: number;
  hr_upscaler?: HiResUpscalerName;
  hr_second_pass_steps?: number;
  hr_resize_x?: number;
  hr_resize_y?: number;
  denoising_strength?: number;
  firstphase_width?: number;
  firstphase_height?: number;
  prompt?: string;
  styles?: string[];
  seed?: number;
  subseed?: number;
  subseed_strength?: number;
  seed_resize_from_h?: number;
  seed_resize_from_w?: number;
  batch_size?: number;
  n_iter?: number;
  steps?: number;
  cfg_scale?: number;
  width?: number;
  height?: number;
  restore_faces?: boolean;
  tiling?: boolean;
  do_not_save_samples?: boolean;
  do_not_save_grid?: boolean;
  negative_prompt?: string;
  eta?: number;
  s_churn?: number;
  s_tmax?: number;
  s_tmin?: number;
  s_noise?: number;
  override_settings?: Record<string, unknown>;
  override_settings_restore_afterwards?: boolean;
  script_args?: unknown[];
  script_name?: string;
  send_images?: boolean;
  save_images?: boolean;
  alwayson_scripts?: Record<string, unknown>;
  controlnet_units?: ControlNetUnit[];
  sampler_name?: SamplerName;
  use_deprecated_controlnet?: boolean;
};

export type Img2ImgOptions = {
  init_images: Sharp[];
  resize_mode?: number;
  denoising_strength?: number;
  image_cfg_scale?: number;
  mask_image?: any;
  mask_blur?: number;
  inpainting_fill?: number;
  inpaint_full_res?: number;
  inpaint_full_res_padding?: number;
  inpainting_mask_invert?: number;
  initial_noise_multiplier?: number;
  prompt?: string;
  styles?: [];
  seed?: number;
  subseed?: number;
  subseed_strength?: number;
  seed_resize_from_h?: number;
  seed_resize_from_w?: number;
  sampler_name?: SamplerName;
  batch_size?: number;
  n_iter?: number;
  steps?: number;
  cfg_scale?: number;
  width?: number;
  height?: number;
  restore_faces?: boolean;
  tiling?: boolean;
  do_not_save_samples?: boolean;
  do_not_save_grid?: boolean;
  negative_prompt?: string;
  eta?: number;
  s_churn?: number;
  s_tmax?: number;
  s_tmin?: number;
  s_noise?: number;
  override_settings?: {};
  override_settings_restore_afterwards?: boolean;
  script_args?: [];
  include_init_images?: boolean;
  script_name?: string;
  send_images?: boolean;
  save_images?: boolean;
  alwayson_scripts?: {};
  controlnet_units?: ControlNetUnit[];
  use_deprecated_controlnet?: boolean;
};

export type ExtraBaseOptions = {
  image: Sharp;
  resize_mode?: number;
  show_extras_results?: boolean;
  gfpgan_visibility?: number;
  codeformer_weight?: number;
  upscaling_resize?: number;
  upscaling_resize_w?: number;
  upscaling_resize_h?: number;
  upscaling_resize_crop?: boolean;
  upscaler_1?: UpscalerName;
  upscaler_2?: UpscalerName;
  extras_upscaler_2_visibility?: number;
  upscale_first?: boolean;
};

export type ExtraSingleOptions = {
  image: Sharp;
} & ExtraBaseOptions;

export type ExtraBatchOptions = {
  images: Sharp[];
  name_list: string[];
} & ExtraBaseOptions;

type ControlNetModule =
  | "none"
  | "canny"
  | "depth"
  | "depth_leres"
  | "hed"
  | "mlsd"
  | "normal_map"
  | "openpose"
  | "openpose_hand"
  | "clip_vision"
  | "color"
  | "pidinet"
  | "scribble"
  | "fake_scribble"
  | "segmentation"
  | "binary"
  | string;

export type ResizeMode = "Scale to Fit (Inner Fit)";

export type Progress = {
  progress: number;
  eta_relative: number;
  state: {
    skipped: boolean;
    interrupted: boolean;
    job: string;
    job_count: number;
    job_timestamp: string;
    job_no: number;
    sampling_step: number;
    sampling_steps: number;
  };
  current_image: string;
  textinfo: string;
};

export type Sampler = {
  name: string;
  aliases: string[];
  options: Record<string, unknown>;
};

export type Upscaler = {
  name: string;
  model_name: string;
  model_path: string;
  model_url: string;
  scale: number;
};

export type StableDiffusionModel = {
  title: string;
  model_name: string;
  hash: string;
  sha256: string;
  filename: string;
  config: string;
};

export type HyperNetwork = {
  name: string;
  path: string;
};

export type FaceRestorer = {
  name: string;
  cmd_dir: string;
};

export type RealESRGanModel = {
  name: string;
  path: string;
  scale: number;
};

export type PromptStyle = {
  name: string;
  prompt: string;
  negative_prompt: string;
};

export type ControlNetUnitConfig = {
  input_image: Sharp;
  mask?: Sharp;
  module: ControlNetModule;
  model?: string;
  weight?: number;
  resize_mode?: ResizeMode;
  lowvram?: boolean;
  processor_res?: number;
  threshold_a?: number;
  threshold_b?: number;
  guidance?: number;
  guidance_start?: number;
  guidance_end?: number;
  guessmode?: boolean;
};

export type ControlNetDetectOptions = {
  controlnet_module?: ControlNetModule | string;
  controlnet_input_images: Sharp[];
  controlnet_processor_res?: number;
  controlnet_threshold_a?: number;
  controlnet_threshold_b?: number;
};

export type ControlNetTxt2ImgOptions = {};
