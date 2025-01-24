import mongoose from "mongoose";

const collectionName = "UserEvent";

const { Schema } = mongoose;

const schema = new Schema({
  date: { type: String, required: [true, "date is required."] },
  eventName: { type: String, required: [true, "eventName is required."] },
  firstName: { type: String, required: [true, "firstName is required."] },
  eventDescription: {
    type: String,
    required: [true, "eventDescription is required."],
  },
  eventType: {
    type: String,
    required: [true, "eventTypeSelect is required."],
  },
  dataId: { type: String, required: [true, "userId is required."] },
  benefitCost: { type: String },
  penalty: { type: String },
  reward: { type: String },
  title: { type: String, default: "E" },
});

const UserEventModel =
  mongoose.models[collectionName] || mongoose.model(collectionName, schema);

export default UserEventModel;
