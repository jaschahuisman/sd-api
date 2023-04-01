import { type Sharp } from "sharp";

/**
 * Converts an image buffer to base64
 *
 * @param {Buffer} image image buffer to convert to base64
 * @param {boolean} raw if true, returns the raw base64 string, if false, returns a data url with the base64 string
 * @returns {Promise<string>} base64 encoded image
 */
export async function toBase64(
  image: Sharp,
  raw: boolean = false
): Promise<string> {
  const header = "data:image/png;base64,";

  const result = raw
    ? (await image.raw().toBuffer()).toString("base64")
    : header + (await image.png().toBuffer()).toString("base64");

  return result;
}