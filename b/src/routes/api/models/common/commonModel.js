"use strict";

export class CommonModel {
  static registryUser() {
    return {
      firstName: { type: String, required: [true, "First Name is required."] },
      middleName: {
        type: String,
        required: [true, "Middle Name is required."],
      },
      lastName: { type: String, required: [true, "Last Name is required."] },
      gender: { type: String, required: [true, "Gender is required."] },
      status: { type: String, required: [true, "Status is required."] },
      birthdate: { type: String, required: [true, "Birthdate is required."] },
      email: { type: String, unique: true },
      street: { type: String },
      purok: { type: String },
      brgy: { type: String, required: [true, "Barangay is required."] },
      city: { type: String, required: [true, "City is required."] },
      province: { type: String, required: [true, "Province is required."] },
      country: { type: String, required: [true, "Country is required."] },
      contactNumber1: {
        type: String,
        required: [true, "Contact number at least 1 is required."],
      },
      contactNumber2: { type: String },
      contactNumber3: { type: String },
      SSS: { type: String },
      PagIbig: { type: String },
      PhilHealth: { type: String },
      TIN: { type: String },
      contactPersonNameInEmergency: {
        type: String,
        required: [true, "Contact Person Name In Emergency is required."],
      },
      contactPersonNumberInEmergency: {
        type: String,
        required: [true, "Contact Person Number In Emergency is required."],
      },
      image: { type: String, required: [true, "Image is required."] },
    };
  }
}
