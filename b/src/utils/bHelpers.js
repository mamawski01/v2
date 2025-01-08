import { promises } from "fs";
import Joi from "joi";
import { schemaResult } from "./joiValidator.js";

export async function deleteImage(path) {
  console.log(path, " deleteImage");
  if (!path || path === undefined) {
    console.log(`path is undefined, deleteImage fx is ${path},`);
    return `path is undefined, deleteImage fx is ${path},`;
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await promises.unlink(path);
    console.log(`File deleted successfully.`);
    return `File deleted successfully.`;
  } catch (error) {
    console.log(error);
    return `${error},`;
  }
}

export function fileUrl(loc = "") {
  const schema = Joi.object({
    loc: Joi.string(),
  }).validate({ loc });
  schemaResult(schema);
  return "http://localhost:7000/uploads/" + loc;
}
