import mongoose from "mongoose";

const collectionName = "UserPayroll";

const { Schema } = mongoose;

const schema = new Schema({
  uniqueData: { type: String, unique: true },

  defWagePerHr: { type: String },
  wagePerHrWEvent: { type: String },
  dutyHrs: { type: String },
  dutyHrsW: { type: String },

  defOTWagePerHr: { type: String },
  OTwagePerHrWEvent: { type: String },
  OTHrs: { type: String },
  OTHrsW: { type: String },

  dailyW: { type: String },
  dailyWMulti: { type: String },
  dayOffW: { type: String },

  sssAllowance: { type: String },
  totalW: { type: String },

  stats: {
    late: { type: String },
    overtime: { type: String },
    underTime: { type: String },
    overBrk: { type: String },
  },

  event: { type: String },
  firstName: { type: String },
  dataId: { type: String },
  title: { type: String, default: "P" },
});

const UserPayrollModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default UserPayrollModel;
