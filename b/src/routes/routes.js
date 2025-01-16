"use strict";
import express from "express";
import jwt from "jsonwebtoken";

import {
  deleteFile,
  getAll,
  getLocal,
  getOne,
  getUrl,
  loginFile,
  patchFile,
  patchPasswordFile,
  postFile,
  postOne,
  transferOne,
} from "./api/bApi.js";
import { upload } from "../utils/multer.js";
import RegistryUserModel from "./api/models/RegistryUserModel.js";
import ConfirmedUserModel from "./api/models/ConfirmedUserModel.js";
import WeeklyUserScheduleModel from "./api/models/WeeklyUserScheduleModel.js";

export const routes = express.Router();

export const urlArr = [
  //url
  { url: "/systemUrl/getException" },
  // registryUser
  { url: "/registryUser/getAll", model: RegistryUserModel },
  { url: "/registryUser/getOne/:id", model: RegistryUserModel },
  {
    url: "/registryUser/postFile",
    model: RegistryUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/registryUser/patchFile/:id",
    model: RegistryUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/registryUser/removeFile/:id",
    model: RegistryUserModel,
    folderName: "userImgFol",
  },
  //confirmedUser
  { url: "/confirmedUser/getAll", model: ConfirmedUserModel },
  {
    url: "/confirmedUser/getOne/:id",
    model: ConfirmedUserModel,
  },
  {
    url: "/registryUserToConfirmedUser/transferOne/:id",
    model: ConfirmedUserModel,
    modelToBeTransfer: RegistryUserModel,
    modelToBeAddedObj: [
      {
        model: WeeklyUserScheduleModel,
        entry: "weeklySchedule",
      },
    ],
  },
  {
    url: "/confirmedUser/patchPasswordFile/:id",
    model: ConfirmedUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/confirmedUser/removeFile/:id",
    model: ConfirmedUserModel,
    folderName: "userImgFol",
  },
  {
    url: "/confirmedUser/loginFile",
    model: ConfirmedUserModel,
  },
];

//for systemUrl
export const urlEvents = urlArr.map((item) => item.url);

//for socket io
export const events = urlEvents.map((url) => {
  const firstWord = url.split("/")[1];
  const secondWord =
    url.split("/")[2].charAt(0).toUpperCase() + url.split("/")[2].slice(1);
  return firstWord + secondWord;
});

urlArr.forEach((item) => {
  if (item.url.includes("getException")) {
    routes.get(item.url, (rq, rs) => getUrl(rq, rs));
  }
  if (item.url.includes("getLocal")) {
    routes.get(item.url, verifyToken, (rq, rs) => getLocal(rq, rs, item.model));
  }
  if (item.url.includes("getAll")) {
    routes.get(item.url, verifyToken, (rq, rs) => getAll(rq, rs, item.model));
  }
  if (item.url.includes("getOne")) {
    routes.get(item.url, verifyToken, (rq, rs) =>
      getOne(rq, rs, item.model, item.populate)
    );
  }
  if (item.url.includes("postFile")) {
    routes.post(
      item.url,
      verifyToken,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => postFile(rq, rs, item.model, item.folderName)
    );
  }
  if (item.url.includes("patchFile")) {
    routes.patch(
      item.url,
      verifyToken,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => patchFile(rq, rs, item.model, item.folderName)
    );
  }
  if (item.url.includes("patchPasswordFile")) {
    routes.patch(
      item.url,
      verifyToken,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => patchPasswordFile(rq, rs, item.model, item.folderName)
    );
  }
  if (item.url.includes("removeFile")) {
    routes.delete(item.url, verifyToken, (rq, rs) => {
      deleteFile(rq, rs, item.model, item.folderName);
    });
  }
  if (item.url.includes("transferOne")) {
    routes.post(item.url, verifyToken, (rq, rs) => {
      transferOne(
        rq,
        rs,
        item.model,
        item.modelToBeTransfer,
        item.modelToBeAddedObj
      );
    });
  }
  if (item.url.includes("loginFile")) {
    routes.post(
      item.url,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => {
        loginFile(rq, rs, item.model);
      }
    );
  }
  if (item.url.includes("postOne")) {
    routes.post(item.url, verifyToken, (rq, rs) => {
      postOne(rq, rs, item.model);
    });
  }
});

function verifyToken(rq, rs, nxt) {
  let token = rq.body.token || rq.query.token || rq.headers["authorization"];

  if (!token)
    return rs.status(401).send("Token is required for authentication.");

  try {
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    rq.dataToken = decoded;
  } catch (error) {
    return rs.status(401).send("Invalid Token, " + error);
  }
  return nxt();
}
