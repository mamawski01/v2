import mongoose from "mongoose";
import { CommonModel } from "./common/commonModel.js";

const collectionName = "UserFinalTimelog";

const { Schema } = mongoose;

const schema = new Schema({
  ...CommonModel.userTimelog(),
  title: { type: String, default: "UFT" },
});

const UserFinalTimelogModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default UserFinalTimelogModel;
