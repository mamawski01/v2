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

export async function onDeleteConfirmedUser(mutate, id, userId) {
  const confirmDelete = await swalAlert(
    "Yes, delete a confirmed user and all of its data.",
  );
  if (confirmDelete.isConfirmed) {
    mutate(remove(confirmedUserRemoveFile + id));
    if (userId) {
      ("");
    }
  }
}

export const resetDev = {
  firstName: "John",
  middleName: "Doe",
  lastName: "Smith",
  gender: { value: "female", label: "female" },
  status: { value: "married", label: "married" },
  birthdate: {
    startDate: dayjs().$d,
    endDate: dayjs().$d,
  },
  employmentDate: {
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
