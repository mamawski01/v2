import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import Joi from "joi";
import { schemaResult } from "../utils/joiValidator.js";

export const defineAbility = ({ id, role, fileId }) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (role === "admin") can("manage", "all");

  if (role === "manager") {
    console.log("manager");
    can("read", "all");
    can("manage", "registryUser");
    cannot("update", "confirmedUser");
    if (sameId(id, fileId)) can("delete", "confirmedUser");
    can("manage", "userSchedule");
  }

  if (role === "user") {
    can("read", "all");
  }
  return build();
};

function sameId(ownerId, fileId) {
  const schema = Joi.object({
    ownerId: Joi.string(),
    fileId: Joi.string(),
  }).validate({ ownerId, fileId });
  schemaResult(schema);

  if (ownerId === fileId) return true;
  return false;
}

export function eventsFormatter(url) {
  const events = url.map((url) => {
    const firstWord = url.split("/")[1];
    const secondWord =
      url.split("/")[2].charAt(0).toUpperCase() + url.split("/")[2].slice(1);
    return firstWord + secondWord;
  });
  return events;
}

export function camelCaseToSingleWord(str) {
  let [first, second] = str.split(/(?=[A-Z])/);
  return `${first}${second}`;
}
