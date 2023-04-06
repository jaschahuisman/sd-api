import { type DefaultOptions, type Img2ImgProps } from "../../types";
import { toBase64 } from "../base64";
import convertBaseProps from "./convertBaseProps";

const convertImg2ImgProps = async (
  props: Img2ImgProps,
  defaultOptions: DefaultOptions
) => {
  const { image, maskImage } = props;

  const init_images = Array.isArray(image)
    ? await Promise.all(image.map((img) => toBase64(img)))
    : [await toBase64(image)];

  const mask_image = maskImage ? await toBase64(maskImage) : undefined;

  return {
    ...(await convertBaseProps(props, defaultOptions)),
    init_images,
    mask_image,
    resize_mode: props.resizeMode ?? 0,
    image_cfg_scale: props.imageCfgScale ?? 1.5,
    mask_blur: props.maskBlur ?? 4,
    inpainting_fill: props.inpaintingFill ?? 0,
    inpaint_full_res: props.inpaintingFullRes ?? false,
    inpaint_full_res_padding: props.inpaintingFullResPadding ?? 0,
    inpainting_mask_invert: props.inpaintingMaskInvert ?? false,
    initial_noise_multiplier: props.initialNoiseMultiplier ?? 1,
    include_init_images: props.includeInitImages ?? false,
  };
};

export default convertImg2ImgProps;
