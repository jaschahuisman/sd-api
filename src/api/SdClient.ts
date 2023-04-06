import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";
import img2img from "./endpoints/img2img";
import txt2img from "./endpoints/txt2img";
import {
  type DefaultOptions,
  type Img2ImgProps,
  type Txt2ImgProps,
} from "../types";
import ControlNetClient from "./ControlNetClient";

export default class SdClient {
  public readonly axiosInstance: AxiosInstance;
  public defaultOptions: DefaultOptions;

  constructor(
    apiConfig?: CreateAxiosDefaults,
    defaultOptions: Partial<DefaultOptions> = {}
  ) {
    const defaultApiConfig = {
      baseURL: "http://127.0.0.1:7860",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    this.axiosInstance = axios.create({ ...defaultApiConfig, ...apiConfig });
    this.defaultOptions = {
      steps: 20,
      samplerName: "Euler a",
      cfgScale: 7,
      width: 512,
      height: 512,
      batchSize: 1,
      nIter: 1,
      ...defaultOptions,
    };
  }

  public setAuth(username: string, password: string) {
    this.axiosInstance.defaults.auth = {
      username,
      password,
    };
  }

  public img2img = async (props: Img2ImgProps) => await img2img(this, props);
  public txt2img = async (props: Txt2ImgProps) => await txt2img(this, props);

  public controlNet = new ControlNetClient(this);
}
