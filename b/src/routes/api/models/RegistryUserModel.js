"use strict";

import mongoose from "mongoose";
import { CommonModel } from "./common/commonModel.js";

const collectionName = "RegistryUser";

const { Schema } = mongoose;
const schema = new Schema(CommonModel.registryUser());

const RegistryUserModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default RegistryUserModel;
