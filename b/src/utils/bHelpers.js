import { promises } from "fs";
import Joi from "joi";
import { schemaResult } from "./joiValidator.js";
import { PORT } from "../../app.js";

export async function removeFile(path) {
  console.log(path, " deleteFile");
  if (!path || path === undefined) {
    console.log(`path is undefined, deleteFile fx is ${path},`);
    return `path is undefined, deleteFile fx is ${path},`;
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
  return `http://localhost:${PORT}/uploads/` + loc;
}
