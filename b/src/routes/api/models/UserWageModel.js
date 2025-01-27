import mongoose from "mongoose";

const collectionName = "UserWage";

const { Schema } = mongoose;

const schema = new Schema({
  employmentTypeSelect: { type: String },
  positionSelect: { type: String },
  wage: { type: String },
  sssAllowance: { type: String },
  allowance: { type: String },
  dateHired: { type: String },
  firstName: { type: String },
  dataId: { type: String },
  title: { type: String, default: "W" },
});

const UserWageModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default UserWageModel;
