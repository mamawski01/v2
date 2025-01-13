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
      genderSelect: {
        type: String,
        required: [true, "GenderSelect is required."],
      },
      statusSelect: {
        type: String,
        required: [true, "StatusSelect is required."],
      },
      birthDate: { type: String, required: [true, "BirthDate is required."] },
      email: { type: String },
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
      file: { type: String, required: [true, "File is required."] },
    };
  }
}
