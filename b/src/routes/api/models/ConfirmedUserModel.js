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
    unique: [true, "dataId already exist!"],
    default: () => uuidv4({ namespace: collectionName }),
  },
  username: {
    type: String,
    default: "dummyUsername",
  },
  password: {
    type: String,
  },
  weeklySchedule: {
    type: Schema.Types.ObjectId,
    ref: "WeeklyUserSchedule",
  },
  roleSelect: {
    type: String,
    default: "user",
  },
});

const ConfirmedUserModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default ConfirmedUserModel;
