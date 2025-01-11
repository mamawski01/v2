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
  transferOne,
} from "./api/bApi.js";
import { upload } from "../utils/multer.js";
import RegistryUserModel from "./api/models/RegistryUserModel.js";
import ConfirmedUserModel from "./api/models/ConfirmUserModel.js";

export const routes = express.Router();

export const urlArr = [
  //url
  { url: "/systemUrlGetException" },
  // { url: "/urlGetLocal", model: ulr },
  // registryUser
  { url: "/registryUserGetAll", model: RegistryUserModel },
  { url: "/registryUserGetOne/:id", model: RegistryUserModel },
  {
    url: "/registryUserPostFile",
    model: RegistryUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/registryUserPatchFile/:id",
    model: RegistryUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/registryUserRemoveFile/:id",
    model: RegistryUserModel,
    folderName: "userImgFol",
  },
  //confirmUser
  { url: "/confirmUserGetAll", model: ConfirmedUserModel },
  { url: "/confirmUserGetOne/:id", model: ConfirmedUserModel },
  {
    url: "/confirmedUserTransferOne/:id",
    model: ConfirmedUserModel,
    modelToBeTransfer: RegistryUserModel,
  },
  {
    url: "/confirmedUserPatchFile/:id",
    model: ConfirmedUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/confirmedUserRemoveFile/:id",
    model: ConfirmedUserModel,
    folderName: "userImgFol",
  },
];

export const urlEvents = urlArr.map((item) => item.url);

urlArr.forEach((item) => {
  checkUrlFormat(item.url);
  if (item.url.includes("systemUrlGetException")) {
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
    routes.post(
      item.url,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => postFile(rq, rs, item.model, item.folderName)
    );
  }
  if (item.url.includes("PatchFile")) {
    routes.patch(
      item.url,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => patchFile(rq, rs, item.model, item.folderName)
    );
  }
  if (item.url.includes("RemoveFile")) {
    routes.delete(item.url, (rq, rs) => {
      deleteFile(rq, rs, item.model, item.folderName);
    });
  }
  if (item.url.includes("TransferOne")) {
    routes.post(item.url, (rq, rs) => {
      transferOne(rq, rs, item.model, item.modelToBeTransfer);
    });
  }
});

function checkUrlFormat(url) {
  const words = url.replace("/", "").split(/(?=[A-Z])/);
  if (
    words.length !== 4 ||
    words.filter((word) => word.match(/[A-Z]/)).length !== 3
  ) {
    throw new Error(
      "Please follow URL convention: 4 words and 3 capital letters"
    );
  }
}
