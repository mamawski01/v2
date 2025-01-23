import mongoose from "mongoose";

const collectionName = "UserSchedule";

const { Schema } = mongoose;

const schema = new Schema({
  uniqueData: { type: String, unique: true },
  firstName: { type: String, required: [true, "firstName is required."] },
  middleName: { type: String, required: [true, "middleName is required."] },
  lastName: { type: String, required: [true, "lastName is required."] },
  dataId: { type: String, required: [true, "dataId is required."] },
  timeInSelect: { type: String, required: [true, "timeIn is required."] },
  timeOutSelect: { type: String, required: [true, "timeOut is required."] },
  brkDurationSelect: {
    type: String,
    required: [true, "brkDuration is required."],
  },
  title: { type: String, default: "US" },
});

const UserScheduleModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default UserScheduleModel;
