import { type Sharp } from "sharp";
import { type DefaultOptions, type ExtrasProps } from "../../types";
import { toBase64 } from "../base64";

type ImageList = {
  name: string;
  data: string;
};

const createImageList = async (image: Sharp[], imageNames: string[]) => {
  const imageList = [] as ImageList[];
  for (let i = 0; i < image.length; i++) {
    imageList.push({
      name: imageNames[i] ?? `image_${i}`,
      data: await toBase64(image[i]),
    });
  }
  return imageList;
};

const convertImg2ImgProps = async (
  props: ExtrasProps,
  _defaultOptions: DefaultOptions
) => {
  const { image, imageNames } = props;

  const imageObject = Array.isArray(image)
    ? {
        imageList: await createImageList(image, imageNames ?? []),
      }
    : {
        image: await toBase64(image),
      };

  return {
    ...imageObject,
    resize_mode: props.resizeMode ?? 0,
    show_extras_results: props.showExtrasResults ?? true,
    gfpgan_visibility: props.gfpGanVisibility ?? 0,
    codeformer_visibility: props.codeformerVisibility ?? 0,
    codeformer_weight: props.codeformerWeight ?? 0,
    upscaling_resize: props.upscalingResize ?? 2,
    upscaling_resize_w: props.upscalingResizeWidth ?? 512,
    upscaling_resize_h: props.upscalingResizeHeight ?? 512,
    upscaling_crop: props.upscalingCrop ?? true,
    upscaler_1: props.upscaler1 ?? "None",
    upscaler_2: props.upscaler2 ?? "None",
    extras_upscaler_2_visibility: props.extrasUpscaler2Visibility ?? 0,
    upscale_first: props.upscaleFirst ?? false,
  };
};

export default convertImg2ImgProps;
