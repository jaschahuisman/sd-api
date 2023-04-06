import { type ControlNetDetectProps } from "../../../types";
import convertControlNetDetectProps from "../../../utils/props/convertControlNetDetectProps";
import SdResult from "../../../utils/results/SdResult";
import SdClient from "../../SdClient";

const controlNetDetect = async (
  client: SdClient,
  props: ControlNetDetectProps
) => {
  const controlNetDetectProps = await convertControlNetDetectProps(
    props,
    client.defaultOptions
  );
  const response = await client.axiosInstance.post(
    "/controlnet/detect",
    controlNetDetectProps
  );
  return new SdResult(response);
};

export default controlNetDetect;
