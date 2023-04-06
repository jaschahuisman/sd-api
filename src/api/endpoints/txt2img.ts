import { type Txt2ImgProps } from "../../types";
import { convertTxt2ImgProps } from "../../utils/props/convertTxt2ImgProps";
import SdResult from "../../utils/results/SdResult";

import SdClient from "../SdClient";

export default async function txt2img(client: SdClient, props: Txt2ImgProps) {
  const txt2imgProps = convertTxt2ImgProps(props, client.defaultOptions);
  const response = await client.axiosInstance.post(
    "/sdapi/v1/txt2img",
    txt2imgProps
  );
  return new SdResult(response);
}
