import mongoose from "mongoose";

import { CommonModel } from "./common/commonModel.js";

const collectionName = "UserTimelog";

const { Schema } = mongoose;

const schema = new Schema({
  ...CommonModel.userTimelog(),
  title: {
    type: String,
    default: "UT",
  },
});

const UserTimelogModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default UserTimelogModel;
