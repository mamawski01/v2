import mongoose from "mongoose";

const collectionName = "UserTimelog";

const { Schema } = mongoose;

const schema = new Schema({
  uniqueData: { type: String, unique: true },
  dataId: { type: String },
  name: { type: String },
  mode: { type: String },
  dateTime: { type: String },
  title: { type: String, default: "UT" },
});

const UserTimelogModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default UserTimelogModel;
