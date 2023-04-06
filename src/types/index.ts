import { type Sharp } from "sharp";
import ControlNetUnit from "../utils/controlnet/ControlNetUnit";

export type DefaultOptions = {
  steps: number; // steps
  cfgScale: number; // cfg_scale
  samplerName: string; // sampler_name
  width: number; // width
  height: number; // height
  batchSize: number; // batch_size
  nIter: number; // n_iter
};

export type BaseProps = {
  prompt?: string; // prompt
  negativePrompt?: string; // negative_prompt
  steps?: number; // steps
  cfgScale?: number; // cfg_scale
  seed?: number; // seed
  subSeed?: number; // subseed
  subSeedStrength?: number; // subseed_strength
  seedResizeFromHeight?: number; // seed_resize_from_h
  seedResizeFromWidth?: number; // seed_resize_from_w
  batchSize?: number; // batch_size
  nIter?: number; // n_iter
  width?: number; // width
  height?: number; // height
  samplerName?: string; // sampler_name
  restoreFaces?: boolean; // restore_faces
  sendImages?: boolean; // send_images
  saveImages?: boolean; // save_images
  controlNetUnits?: ControlNetUnit[]; // controlnet_units
  styles?: string[]; // styles
  tiling?: boolean; // tiling
  doNotSaveSamples?: boolean; // do_not_save_samples
  doNotSaveGrid?: boolean; // do_not_save_grid
  eta?: number; // eta
  sChurn?: number; // s_churn
  sTmax?: number; // s_tmax
  sTmin?: number; // s_tmin
  sNoise?: number; // s_noise
  overrideSettings?: Record<string, unknown>; // override_settings
  overrideSettingsRestoreAfterwards?: boolean; // override_settings_restore_afterwards
  scriptName?: string; // script_name
  scriptArgs?: unknown[]; // script_args
  alwaysOnScripts?: Record<string, unknown>; // alwayson_scripts
};

export type HiResProps = {
  enable?: boolean; // enable_hr
  scale?: number; // hr_scale
  upscaler?: string; // hr_upscaler
  secondPassSteps?: number; // hr_second_pass_steps
  resizeX?: number; // hr_resize_x
  resizeY?: number; // hr_resize_y
  firstPhaseWidth?: number; // firstphase_width
  firstPhaseHeight?: number; // firstphase_height
  denoisingStrength?: number; // denoising_strength
};

export type Txt2ImgProps = BaseProps & {
  hiRes: HiResProps;
};

export type Img2ImgProps = BaseProps & {
  image: Sharp | Sharp[]; // init_images
  resizeMode?: number; // resize_mode
  imageCfgScale?: number; // image_cfg_scale
  maskImage?: Sharp; // mask_image
  maskBlur?: number; // mask_blur
  inpaintingFill?: number; // inpainting_fill
  inpaintingFullRes?: boolean; // inpainting_full_res
  inpaintingFullResPadding?: number; // inpainting_full_res_padding
  inpaintingMaskInvert?: boolean; // inpainting_mask_invert
  initialNoiseMultiplier?: number; // initial_noise_multiplier
  includeInitImages?: boolean; // include_init_images
};

export type ExtrasProps = {};

export type ControlNetDetectProps = {
  module?: string; // controlnet_module
  image: Sharp | Sharp[]; // controlnet_input_images
  processorResolution?: number; // controlnet_processor_res
  thresholdA?: number; // controlnet_threshold_a
  thresholdB?: number; // controlnet_threshold_b
};

export type ControlNetUnitProps = {
  image?: Sharp; // input_image
  mask?: Sharp; // mask
  module?: string; // module
  model?: string; // model
  weight?: number; // weight
  resizeMode?: string; // resize_mode
  lowVRam?: boolean; // lowvram
  processorResolution?: number; // processor_res
  thresholdA?: number; // threshold_a
  thresholdB?: number; // threshold_b
  guidanceScale?: number; // guidance
  guidanceStart?: number; // guidance_start
  guidanceEnd?: number; // guidance_end
  guessMode?: boolean; // guessmode
};

export type SdResultInfo = {};

export type SdResultParameters = {};
