import multer from "multer";
import path from "path";
import dayjs from "dayjs";
import fs from "fs";
import Joi from "joi";
import { schemaResult } from "./joiValidator.js";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

export function fileLoc(loc = "") {
  const schema = Joi.object({
    loc: Joi.string(),
  }).validate({ loc });
  schemaResult(schema);
  // return "../i/uploads/" + loc;
  return "../b/uploads/" + loc;
}

function fileNameFx(fileName = "") {
  const schema = Joi.object({
    fileName: Joi.string(),
  }).validate({ fileName });
  schemaResult(schema);
  return dayjs(Date.now()).format("YYYY-MM-DD-hh-mm-ssa-SSS") + fileName;
}

export const upload = (folName = "userImgFol", fileName = "userImg") => {
  const schema = Joi.object({
    fileName: Joi.string(),
    folName: Joi.string(),
  }).validate({ fileName, folName });
  schemaResult(schema);
  if (fs.existsSync(fileLoc(folName))) {
    console.log(`Folder already exists ${fileLoc(folName)}`);
  } else {
    fs.mkdir(fileLoc(folName), { recursive: true }, (err) => {
      if (err) throw err;
      console.log(`Folder created at ${fileLoc(folName)}`);
    });
  }

  return multer({
    limits: 50000,
    storage: multer.diskStorage({
      destination: function (_rq, _file, cb) {
        cb(null, fileLoc(folName));
      },
      filename: function (_rq, file, cb) {
        cb(null, fileNameFx(fileName) + path.extname(file.originalname));
      },
    }),
    fileFilter: (_rq, file, cb) => {
      const isValid = !!MIME_TYPE_MAP[file.mimetype];
      let error = isValid ? null : new Error("Invalid mime type!");
      cb(error, isValid);
    },
  });
};
