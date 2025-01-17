import dayjs from "dayjs";
import { remove } from "../../../api/api";
import { swalAlert } from "../../../lib/utils1";
import {
  confirmedUserRemoveFile,
  registryUserRemoveFile,
} from "../../../reusable/hooks/useHook1";

export async function onDeleteRegistryUser(mutate, id) {
  const confirmDelete = await swalAlert("Yes, delete registry user.");
  if (confirmDelete.isConfirmed) {
    mutate(remove(registryUserRemoveFile + id));
  }
}

export async function onDeleteConfirmedUser(mutate, id) {
  const confirmDelete = await swalAlert(
    "Yes, delete a confirmed user and all of its data.",
  );
  if (confirmDelete.isConfirmed) {
    mutate(remove(confirmedUserRemoveFile + id));
  }
}

export function userField(edit) {
  return [
    {
      field: "firstName",
      type: "text",
      isRequired: `firstName is required`,
    },
    {
      field: "middleName",
      type: "text",
      isRequired: `middleName is required`,
    },
    { field: "lastName", type: "text", isRequired: `lastName is required` },
    {
      field: "genderSelect",
      type: "select",
      options: ["male", "female"],
      rules: {
        validate: (value) => {
          if (!value?.value && !value?.label) {
            return `genderSelect is required.`;
          }
          return true;
        },
      },
    },
    {
      field: "statusSelect",
      type: "select",
      options: ["single", "married"],
      rules: {
        validate: (value) => {
          if (!value?.value && !value?.label) {
            return `statusSelect is required.`;
          }
          return true;
        },
      },
    },
    {
      field: "birthDate",
      type: "date",
      rules: {
        validate: (value) => {
          if (!value?.startDate && !value?.endDate) {
            return `birthDate is required.`;
          }
        },
      },
    },
    { field: "email", type: "email", isRequired: `email is required` },
    { field: "street", type: "text", isRequired: false },
    { field: "purok", type: "text", isRequired: false },
    { field: "brgy", type: "text", isRequired: `brgy is required` },
    { field: "city", type: "text", isRequired: `city is required` },
    { field: "province", type: "text", isRequired: `province is required` },
    { field: "country", type: "text", isRequired: `country is required` },
    {
      field: "contactNumber1",
      type: "text",
      isRequired: `contactNumber1 is required`,
    },
    { field: "contactNumber2", type: "text", isRequired: false },
    { field: "contactNumber3", type: "text", isRequired: false },
    { field: "SSS", type: "text", isRequired: false },
    { field: "PagIbig", type: "text", isRequired: false },
    { field: "PhilHealth", type: "text", isRequired: false },
    { field: "TIN", type: "text", isRequired: false },
    {
      field: "contactPersonNameInEmergency",
      type: "text",
      isRequired: `contact person name is required`,
    },
    {
      field: "contactPersonNumberInEmergency",
      type: "text",
      isRequired: `contact person number is required`,
    },
    {
      field: "file",
      type: "file",
      isRequired: edit ? false : `file is required`,
      specifyFile: ".png,.jpg,.jpeg",
    },
  ];
}

export const resetDev = {
  firstName: "John",
  middleName: "Doe",
  lastName: "Smith",
  genderSelect: { value: "female", label: "female" },
  statusSelect: { value: "married", label: "married" },
  birthDate: {
    startDate: dayjs().$d,
    endDate: dayjs().$d,
  },
  email: "johndoe@example.com",
  street: "123 Main St",
  purok: "Purok 1",
  brgy: "Barangay 1",
  city: "Manila",
  province: "Metro Manila",
  country: "Philippines",
  contactNumber1: "09123456789",
  contactNumber2: "09234567890",
  contactNumber3: "09345678901",
  SSS: "1234567890",
  PagIbig: "0987654321",
  PhilHealth: "1234567890",
  TIN: "1234567890",
  contactPersonNameInEmergency: "Jane Doe",
  contactPersonNumberInEmergency: "09123456789",
};
