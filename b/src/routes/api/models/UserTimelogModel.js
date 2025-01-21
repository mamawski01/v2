import mongoose from "mongoose";

const collectionName = "UserTimelog";

const { Schema } = mongoose;

const schema = new Schema({
  uniqueData: {
    type: String,
    unique: true,
    required: [true, "uniqueData is required."],
  },
  dataId: { type: String, required: [true, "firstName is required."] },
  name: { type: String, required: [true, "firstName is required."] },
  mode: { type: String, required: [true, "firstName is required."] },
  dateTime: { type: String, required: [true, "firstName is required."] },
  title: {
    type: String,
    default: "UT",
    required: [true, "firstName is required."],
  },
});

const UserTimelogModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default UserTimelogModel;
