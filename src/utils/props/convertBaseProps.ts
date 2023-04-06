import { type BaseProps, type DefaultOptions } from "../../types";

const convertBaseProps = async (
  props: BaseProps,
  defaultOptions: DefaultOptions
) => {
  const controlnet_units = props.controlNetUnits
    ? await Promise.all(
        props.controlNetUnits.map(async (unit) => unit.convertPropsToArgs())
      )
    : [];

  return {
    prompt: props.prompt ?? "",
    negative_prompt: props.negativePrompt ?? "",
    steps: props.steps ?? defaultOptions.steps,
    cfg_scale: props.cfgScale ?? defaultOptions.cfgScale,
    seed: props.seed ?? -1,
    subseed: props.subSeed ?? -1,
    subseed_strength: props.subSeedStrength ?? 0,
    seed_resize_from_h: props.seedResizeFromHeight ?? 0,
    seed_resize_from_w: props.seedResizeFromWidth ?? 0,
    batch_size: props.batchSize ?? defaultOptions.batchSize,
    n_iter: props.nIter ?? defaultOptions.nIter,
    width: props.width ?? defaultOptions.width,
    height: props.height ?? defaultOptions.height,
    sampler_name: props.samplerName ?? defaultOptions.samplerName,
    restore_faces: props.restoreFaces ?? false,
    controlnet_units,
    send_images: props.sendImages ?? true,
    save_images: props.saveImages ?? false,
    styles: props.styles ?? [],
    tiling: props.tiling ?? false,
    do_not_save_samples: props.doNotSaveSamples ?? false,
    do_not_save_grid: props.doNotSaveGrid ?? false,
    eta: props.eta ?? 1.0,
    s_churn: props.sChurn ?? 0,
    s_tmax: props.sTmax ?? 0,
    s_tmin: props.sTmin ?? 0,
    s_noise: props.sNoise ?? 1,
    override_settings: props.overrideSettings ?? {},
    override_settings_restore_afterwards:
      props.overrideSettingsRestoreAfterwards ?? true,
    script_name: props.scriptName ?? null,
    script_args: props.scriptArgs ?? [],
    alwayson_scripts: props.alwaysOnScripts ?? {},
  };
};

export default convertBaseProps;
