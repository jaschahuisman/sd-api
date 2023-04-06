import { type DefaultOptions, type HiResProps } from "../../types";

const convertHiResProps = (
  props: HiResProps,
  _defaultOptions: DefaultOptions
) => {
  return {
    enable_hr: props.enable ?? false,
    hr_scale: props.scale ?? 2,
    hr_upscaler: props.upscaler ?? "Lanczos",
    hr_second_pass_steps: props.secondPassSteps ?? 0,
    hr_resize_x: props.resizeX ?? 0,
    hr_resize_y: props.resizeY ?? 0,
    firstphase_width: props.firstPhaseWidth ?? 0,
    firstphase_height: props.firstPhaseHeight ?? 0,
    denoising_strength: props.denoisingStrength ?? 0.7,
  };
};

export default convertHiResProps;
