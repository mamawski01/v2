"use strict";
import express from "express";

import { getAll, getOne, registryUserBEPostCustom } from "./api/bApi.js";
import { upload } from "../utils/multer.js";
import RegistryUserModel from "./api/models/RegistryUserModel.js";
import ConfirmedUserModel from "./api/models/ConfirmUserModel.js";

export const routes = express.Router();

const userImgFolName = "userImgFol";
const userImgImgName = "userImg";

export const urlArr = [
  // registryUser
  { url: "/registryUserBEGetAll", model: RegistryUserModel },
  { url: "/registryUserBEGetOne/:id", model: RegistryUserModel },
  { url: "/registryUserBEPostCustom", model: RegistryUserModel },
  //confirmUser
  { url: "/confirmUserBEGetAll", model: ConfirmedUserModel },
];

urlArr.forEach((item) => {
  if (item.url.includes("GetAll")) {
    routes.get(item.url, (rq, rs) => getAll(rq, rs, item.model));
  }
  if (item.url.includes("GetOne")) {
    routes.get(item.url, (rq, rs) => getOne(rq, rs, item.model));
  }
  if (item.url.includes("registryUserBEPostCustom")) {
    routes.post(item.url, (rq, rs) => {
      upload(userImgFolName, userImgImgName).single("image"),
        registryUserBEPostCustom(rq, rs, item.model, userImgFolName);
    });
  }
});
