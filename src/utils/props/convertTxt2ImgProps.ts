import { type DefaultOptions, type Txt2ImgProps } from "../../types";
import convertBaseProps from "./convertBaseProps";
import convertHiResProps from "./convertHiResProps";

export const convertTxt2ImgProps = (
  props: Txt2ImgProps,
  defaultOptions: DefaultOptions
) => {
  return {
    ...convertBaseProps(props, defaultOptions),
    ...convertHiResProps(props.hiRes, defaultOptions),
  };
};
