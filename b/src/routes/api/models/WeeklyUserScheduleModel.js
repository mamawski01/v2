import mongoose from "mongoose";

const collectionName = "WeeklyUserSchedule";

const { Schema } = mongoose;

const schema = new Schema({
  brkDurationSelect: {
    type: String,
    required: [true, "Break duration is required"],
    default: "60 mins",
  },
  monday: {
    timeInSelect: {
      type: String,
      required: [true, "Monday time in is required"],
      default: "09:00 am",
    },
    timeOutSelect: {
      type: String,
      required: [true, "Monday time out is required"],
      default: "06:00 pm",
    },
    day: {
      type: String,
      required: [true, "Monday day is required"],
      default: "monday",
    },
  },
  tuesday: {
    timeInSelect: {
      type: String,
      required: [true, "Tuesday time in is required"],
      default: "09:00 am",
    },
    timeOutSelect: {
      type: String,
      required: [true, "Tuesday time out is required"],
      default: "06:00 pm",
    },
    day: {
      type: String,
      required: [true, "Tuesday day is required"],
      default: "tuesday",
    },
  },
  wednesday: {
    timeInSelect: {
      type: String,
      required: [true, "Wednesday time in is required"],
      default: "09:00 am",
    },
    timeOutSelect: {
      type: String,
      required: [true, "Wednesday time out is required"],
      default: "06:00 pm",
    },
    day: {
      type: String,
      required: [true, "Wednesday day is required"],
      default: "wednesday",
    },
  },
  thursday: {
    timeInSelect: {
      type: String,
      required: [true, "Thursday time in is required"],
      default: "09:00 am",
    },
    timeOutSelect: {
      type: String,
      required: [true, "Thursday time out is required"],
      default: "06:00 pm",
    },
    day: {
      type: String,
      required: [true, "Thursday day is required"],
      default: "thursday",
    },
  },
  friday: {
    timeInSelect: {
      type: String,
      required: [true, "Friday time in is required"],
      default: "09:00 am",
    },
    timeOutSelect: {
      type: String,
      required: [true, "Friday time out is required"],
      default: "06:00 pm",
    },
    day: {
      type: String,
      required: [true, "Friday day is required"],
      default: "friday",
    },
  },
  saturday: {
    timeInSelect: {
      type: String,
      required: [true, "Saturday time in is required"],
      default: "09:00 am",
    },
    timeOutSelect: {
      type: String,
      required: [true, "Saturday time out is required"],
      default: "06:00 pm",
    },
    day: {
      type: String,
      required: [true, "Saturday day is required"],
      default: "saturday",
    },
  },
  sunday: {
    timeInSelect: {
      type: String,
      required: [true, "Sunday time in is required"],
      default: "09:00 am",
    },
    timeOutSelect: {
      type: String,
      required: [true, "Sunday time out is required"],
      default: "06:00 pm",
    },
    day: {
      type: String,
      required: [true, "Sunday day is required"],
      default: "sunday",
    },
  },
});

const WeeklyUserScheduleModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default WeeklyUserScheduleModel;
