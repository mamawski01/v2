"use strict";
import express from "express";

import {
  deleteFile,
  getAll,
  getLocal,
  getOne,
  getUrl,
  patchFile,
  postFile,
  replaceOne,
} from "./api/bApi.js";
import { upload } from "../utils/multer.js";
import RegistryUserModel from "./api/models/RegistryUserModel.js";
import ConfirmedUserModel from "./api/models/ConfirmUserModel.js";

export const routes = express.Router();

export const urlArr = [
  //url
  { url: "/getUrl" },
  // { url: "/urlGetLocal", model: ulr },
  // registryUser
  { url: "/registryUserBEGetAll", model: RegistryUserModel },
  { url: "/registryUserBEGetOne/:id", model: RegistryUserModel },
  {
    url: "/registryUserBEPostFile",
    model: RegistryUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/registryUserBEPatchFile/:id",
    model: RegistryUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/registryUserBERemoveFile/:id",
    model: RegistryUserModel,
    folderName: "userImgFol",
  },
  //confirmUser
  { url: "/confirmUserBEGetAll", model: ConfirmedUserModel },
  { url: "/confirmUserBEGetOne/:id", model: ConfirmedUserModel },
  {
    url: "/confirmedUserBEReplaceOne/:id",
    model: ConfirmedUserModel,
    modelToBeReplaced: RegistryUserModel,
  },
  {
    url: "/confirmedUserBEPatchFile/:id",
    model: ConfirmedUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/confirmedUserBERemoveFile/:id",
    model: ConfirmedUserModel,
    folderName: "userImgFol",
  },
];

export const urlEvents = urlArr.map((item) => item.url);

urlArr.forEach((item) => {
  if (item.url.includes("getUrl")) {
    routes.get(item.url, (rq, rs) => getUrl(rq, rs));
  }
  if (item.url.includes("GetLocal")) {
    routes.get(item.url, (rq, rs) => getLocal(rq, rs, item.model));
  }
  if (item.url.includes("GetAll")) {
    routes.get(item.url, (rq, rs) => getAll(rq, rs, item.model));
  }
  if (item.url.includes("GetOne")) {
    routes.get(item.url, (rq, rs) => getOne(rq, rs, item.model));
  }
  if (item.url.includes("PostFile")) {
    routes.post(item.url, (rq, rs) => {
      upload(item.folderName, item.fileName).single("file"),
        postFile(rq, rs, item.model, item.folderName);
    });
  }
  if (item.url.includes("PatchFile")) {
    routes.patch(item.url, (rq, rs) => {
      upload(item.folderName, item.fileName).single("file"),
        patchFile(rq, rs, item.model, item.folderName);
    });
  }
  if (item.url.includes("RemoveFile")) {
    routes.patch(item.url, (rq, rs) => {
      deleteFile(rq, rs, item.model, item.folderName);
    });
  }
  if (item.url.includes("ReplaceOne")) {
    routes.patch(item.url, (rq, rs) => {
      replaceOne(rq, rs, item.model, item.modelToBeReplaced);
    });
  }
});
