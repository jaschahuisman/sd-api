import { type ControlNetDetectProps, type DefaultOptions } from "../../types";
import { toBase64 } from "../base64";

const convertControlNetDetectProps = async (
  props: ControlNetDetectProps,
  _defaultOptions: DefaultOptions
) => {
  const { image } = props;

  const input_images = Array.isArray(image)
    ? await Promise.all(image.map((img) => toBase64(img)))
    : [await toBase64(image)];

  return {
    controlnet_module: props.module ?? "none",
    controlnet_input_images: input_images,
    controlnet_processor_res: props.processorResolution,
    controlnet_threshold_a: props.thresholdA,
    controlnet_threshold_b: props.thresholdB,
  };
};

export default convertControlNetDetectProps;
