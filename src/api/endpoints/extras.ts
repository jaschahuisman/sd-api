import { type ExtrasProps } from "../../types";
import convertExtrasProps from "../../utils/props/convertExtrasProps";
import SdResult from "../../utils/results/SdResult";
import SdClient from "../SdClient";

export default async function extras(client: SdClient, props: ExtrasProps) {
  const extrasProps = await convertExtrasProps(props, client.defaultOptions);
  const endpoint = Array.isArray(props.image)
    ? "/sdapi/v1/extras-batch"
    : "/sdapi/v1/extras";
  const response = await client.axiosInstance.post(endpoint, extrasProps);
  return new SdResult(response);
}
