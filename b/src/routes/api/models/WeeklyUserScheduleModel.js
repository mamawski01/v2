import mongoose from "mongoose";

const collectionName = "WeeklyUserSchedule";

const { Schema } = mongoose;

const schema = new Schema({
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  brkDuration: { type: String, default: "60 mins" },
  monday: {
    timeIn: { type: String, default: "09:00 am" },
    timeOut: { type: String, default: "06:00 pm" },
    day: { type: String, default: "monday" },
  },
  tuesday: {
    timeIn: { type: String, default: "09:00 am" },
    timeOut: { type: String, default: "06:00 pm" },
    day: { type: String, default: "tuesday" },
  },
  wednesday: {
    timeIn: { type: String, default: "09:00 am" },
    timeOut: { type: String, default: "06:00 pm" },
    day: { type: String, default: "wednesday" },
  },
  thursday: {
    timeIn: { type: String, default: "09:00 am" },
    timeOut: { type: String, default: "06:00 pm" },
    day: { type: String, default: "thursday" },
  },
  friday: {
    timeIn: { type: String, default: "09:00 am" },
    timeOut: { type: String, default: "06:00 pm" },
    day: { type: String, default: "friday" },
  },
  saturday: {
    timeIn: { type: String, default: "09:00 am" },
    timeOut: { type: String, default: "06:00 pm" },
    day: { type: String, default: "saturday" },
  },
  sunday: {
    timeIn: { type: String, default: "09:00 am" },
    timeOut: { type: String, default: "06:00 pm" },
    day: { type: String, default: "sunday" },
  },
});

const WeeklyUserScheduleModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default WeeklyUserScheduleModel;
