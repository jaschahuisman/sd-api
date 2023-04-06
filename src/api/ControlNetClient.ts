import { type ControlNetDetectProps } from "../types";
import SdClient from "./SdClient";
import controlNetDetect from "./endpoints/controlnet/detect";

export default class ControlNetClient {
  constructor(private client: SdClient) {}

  public detect = async (props: ControlNetDetectProps) =>
    await controlNetDetect(this.client, props);
}
