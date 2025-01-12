"use strict";

import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

import { CommonModel } from "./common/commonModel.js";

const collectionName = "ConfirmedUser";

const { Schema } = mongoose;
const schema = new Schema({
  ...CommonModel.registryUser(),
  dataId: {
    type: String,
    unique: true,
    default: uuidv4(),
  },
});

const ConfirmedUserModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default ConfirmedUserModel;
