# Stable Diffusion Api

![npm](https://img.shields.io/npm/v/stable-diffusion-api)
![npm](https://img.shields.io/npm/dw/stable-diffusion-api)
![GitHub](https://img.shields.io/github/license/jaschahuisman/sd-api)

[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white)](https://www.npmjs.com/package/stable-diffusion-api)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white)](https://www.github.com/jaschahuisman/sd-api)

A Typescript API client for [AUTOMATIC111/stable-diffusion-webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) API that is unremarkably inspired by the Python library [webuiapi](https://github.com/mix1009/sdwebuiapi).

- [Stable Diffusion Api](#stable-diffusion-api)
  - [Requisites](#requisites)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Instantiation](#instantiation)
    - [Authentication](#authentication)
    - [txt2img](#txt2img)
    - [img2img](#img2img)
  - [ControlNet Extension API usage](#controlnet-extension-api-usage)
    - [Get models and modules](#get-models-and-modules)
    - [ControlNetUnit](#controlnetunit)
    - [detect](#detect)

## Requisites

- To use this API client, you have to run `stable-diffusion-webui` with the `--api` command line argument.
- Optionally you can add `--nowebui` to disable the web interface.

## Installation

```bash
npm install stable-diffusion-api
```

```bash
yarn add stable-diffusion-api
```

## Usage

### Instantiation

```typescript
import StableDiffusionApi from "stable-diffusion-api";

const api = new StableDiffusionApi();

const api = new StableDiffusionApi({
  host: "localhost",
  port: 7860,
  protocol: "http",
  defaultSampler: "Euler a",
  defaultStepCount: 20,
});

const api = new StableDiffusionApi({
  baseUrl: "http://localhost:7860",
});
```

### Authentication

Use the `--api-auth` command line argument with "username:password" on the server to enable API authentication.

```typescript
api.setAuth("username", "password");
```

### txt2img

```typescript
const result = await api.txt2img({
    prompt: "An AI-powered robot that accidentally starts doing everyone's job, causing chaos in the workplace."
    ...
})

result.image.toFile('result.png')
```

| Result
|:-------------------------:
| ![](assets/img/robot_workplace.png)

### img2img

```typescript
const image = sharp('image.png')

const result = await api.img2img({
    init_images: [image],
    prompt: "Man, scared of AGI, running away on a burning lava floor."
    ...
})

result.image.toFile('result.png')
```

|               Input               |             Result             |
| :-------------------------------: | :----------------------------: |
| ![](assets/img/running_track.png) | ![](assets/img/lava_floor.png) |

---

## ControlNet Extension API usage

- To use the ControlNet API, you must have installed the [ControlNet extension](https://github.com/Mikubill/sd-webui-controlnet) into your `stable-diffusion-webui` instance.
- It's also necessary to have the desired ControlNet models installed into the extension's models directory.

### Get models and modules

To get a list of all installed ControlNet models and modules, you can use the `api.ControlNet.getModels()` and `api.ControlNet.getModules()` methods.

```typescript
const models = await api.ControlNet.getModels();
const modules = await api.ControlNet.getModules();
```

### ControlNetUnit

To make use of the ControlNet API, you must first instantiate a `ControlNetUnit` object in wich you can specify the ControlNet model and preprocessor to use. Next, to use the unit, you must pass it as an array in the `controlnet_units` argument in the `txt2img` or `img2img` methods.

It's also possible to use multiple ControlNet units in the same request. To get some good results, it's recommended to use lower weights for each unit by setting the `weight` argument to a lower value.

To get a list of all installed ControlNet models, you can use the `api.ControlNet.getModels()` method.

```typescript
const image = sharp("image.png");

const controlNetUnit = new ControlNetUnit({
  model: "control_sd15_depth [fef5e48e]",
  module: "depth",
  input_images: [image],
  processor_res: 512,
  threshold_a: 64,
  threshold_b: 64,
});

const result = await api.txt2img({
  prompt:
    "Young lad laughing at all artists putting hard work and effort into their work.",
  controlnet_units: [controlNetUnit],
});

result.image.toFile("result.png");

// To access the preprocessing result, you can use the following:

const depth = result.images[1];
depth.toFile("depth.png");
```

|                Input                 |                 Result                 |                   Depth                   |
| :----------------------------------: | :------------------------------------: | :---------------------------------------: |
| ![](assets/img/grandpa_laughing.png) | ![](assets/img/young_lad_laughing.png) | ![](assets/img/grandpa_lauging_depth.png) |

### detect

Uses the selected ControlNet proprocessor module to predict a detection on the input image. To make use of the detection result, you must use the model of choise in the `txt2img` or `img2img` without a preprocessor enabled (use `"none"` as the preprocessor module).

This comes in handy when you just want a detection result without generating a whole new image.

```typescript
const image = sharp("image.png");

const result = await api.ControlNet.detect({
  controlnet_module: "depth",
  controlnet_input_images: [image],
  controlnet_processor_res: 512,
  controlnet_threshold_a: 64,
  controlnet_threshold_b: 64,
});

result.image.toFile("result.png");
```

|            Input             |               Result               |
| :--------------------------: | :--------------------------------: |
| ![](assets/img/food_man.png) | ![](assets/img/food_man_depth.png) |
