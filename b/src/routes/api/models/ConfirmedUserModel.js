"use strict";

import mongoose from "mongoose";

import { CommonModel } from "./common/commonModel.js";

const collectionName = "ConfirmedUser";

const { Schema } = mongoose;
const schema = new Schema({
  ...CommonModel.registryUser(),
  dataId: {
    type: String,
    unique: [true, "dataId already exist!"],
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
  timelog: [
    {
      type: Schema.Types.ObjectId,
      ref: "UserTimelog",
    },
  ],
});

const ConfirmedUserModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default ConfirmedUserModel;
