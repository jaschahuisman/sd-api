import { type Img2ImgProps } from "../../types";
import convertImg2ImgProps from "../../utils/props/convertImg2ImgProps";
import SdResult from "../../utils/results/SdResult";
import SdClient from "../SdClient";

export default async function img2img(client: SdClient, props: Img2ImgProps) {
  const img2imgProps = await convertImg2ImgProps(props, client.defaultOptions);
  const response = await client.axiosInstance.post(
    "/sdapi/v1/img2img",
    img2imgProps
  );
  return new SdResult(response);
}
