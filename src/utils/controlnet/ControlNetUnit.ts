import { type ControlNetUnitProps } from "../../types";
import { toBase64 } from "../base64";

export default class ControlNetUnit {
  constructor(public props: ControlNetUnitProps) {}

  public convertPropsToArgs = async () => {
    const { image, mask } = this.props;
    return {
      input_image: image ? await toBase64(image, true) : null,
      mask: mask ? await toBase64(mask, true) : null,
      module: this.props.module ?? "none",
      model: this.props.model ?? "None",
      weight: this.props.weight ?? 1,
      resize_mode: this.props.resizeMode ?? "none",
      lowvram: this.props.lowVRam ?? false,
      processor_res: this.props.processorResolution ?? 512,
      threshold_a: this.props.thresholdA ?? 64,
      threshold_b: this.props.thresholdB ?? 64,
      guidance: this.props.guidanceScale ?? 1,
      guidance_start: this.props.guidanceStart ?? 0,
      guidance_end: this.props.guidanceEnd ?? 1,
      guessmode: this.props.guessMode ?? false,
    };
  };
}
