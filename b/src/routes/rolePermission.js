export const rolePermissions = {
  admin: ["*"],
  manager: [
    "registryUserGetAll",
    "registryUserGetOne",
    "registryUserPostFile",
    "registryUserPatchFile",
    "registryUserRemoveFile",
    "confirmedUserGetAll",
    "confirmedUserGetOne",
    "registryUserToConfirmedUserTransferOne",
  ],
  user: ["registryUserGetAll", "registryUserGetOne"],
};

import { createMongoAbility } from "@casl/ability";

// Define the abilities for each role
export const abilities = {
  admin: createMongoAbility([
    {
      action: "manage",
      subject: "all",
    },
  ]),
  manager: createMongoAbility([
    {
      action: "manage",
      subject: "registryUserGetAll",
    },
    {
      action: "manage",
      subject: "registryUserGetOne",
    },
    {
      action: "manage",
      subject: "registryUserPostFile",
    },
    {
      action: "manage",
      subject: "registryUserPatchFile",
    },
    {
      action: "manage",
      subject: "registryUserPatchFile",
    },
    {
      action: "manage",
      subject: "confirmedUserGetAll",
    },
    {
      action: "manage",
      subject: "confirmedUserGetOne",
    },
    {
      action: "manage",
      subject: "registryUserToConfirmedUserTransferOne",
    },
    {
      action: "manage",
      subject: "confirmedUserPatchPasswordFile",
      conditions: (user, data, { loggedUserId, documentId }) => {
        console.log(loggedUserId, documentId);

        return loggedUserId === documentId;
      },
    },
  ]),
  user: createMongoAbility([
    {
      action: "read",
      subject: "registryUserGetAll",
    },
    {
      action: "read",
      subject: "confirmedUserGetAll",
    },
  ]),
};

export function eventsFormatter(url) {
  const events = url.map((url) => {
    const firstWord = url.split("/")[1];
    const secondWord =
      url.split("/")[2].charAt(0).toUpperCase() + url.split("/")[2].slice(1);
    return firstWord + secondWord;
  });
  return events;
}
