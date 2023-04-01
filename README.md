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
    - [txt2img](#txt2img)
    - [img2img](#img2img)

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

### txt2img

```typescript
const result = await api.txt2img({
    prompt: "An AI-powered robot that accidentally starts doing everyone's job, causing chaos in the workplace."
    ...
})

result.image.toFile('result.png')
```

| Result image
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

|            Init image             |          Result image          |
| :-------------------------------: | :----------------------------: |
| ![](assets/img/running_track.png) | ![](assets/img/lava_floor.png) |
