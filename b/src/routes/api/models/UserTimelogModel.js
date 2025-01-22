import mongoose from "mongoose";

const collectionName = "UserTimelog";

const { Schema } = mongoose;

const schema = new Schema({
  uniqueData: {
    type: String,
    unique: true,
    required: [true, "uniqueData is required."],
  },
  dataId: { type: String, required: [true, "dataId is required."] },
  name: { type: String, required: [true, "name is required."] },
  mode: { type: String, required: [true, "mode is required."] },
  dateTime: { type: String, required: [true, "dateTime is required."] },
  title: {
    type: String,
    default: "UT",
  },
});

const UserTimelogModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default UserTimelogModel;
