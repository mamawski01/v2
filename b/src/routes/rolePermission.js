import { AbilityBuilder, createMongoAbility } from "@casl/ability";

// Define the abilities for each role
export function getAbilities(user) {
  const roles = {
    admin: createMongoAbility([
      {
        action: "manage",
        subject: "all",
      },
    ]),
    manager: createMongoAbility([
      {
        action: "manage",
        subject: "registryUser",
      },
      {
        action: "read",
        subject: "confirmedUser",
      },
      {
        action: "update",
        subject: "confirmedUser",
        conditions: { ownerId: user.id },
      },
      {
        action: "delete",
        subject: "confirmedUser",
        conditions: { ownerId: user.id },
      },
    ]),
    user: createMongoAbility([
      {
        action: "read",
        subject: "registryUser",
      },
      {
        action: "read",
        subject: "confirmedUser",
      },
    ]),
  };

  return roles[user.role];
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

export const defineAbility = (user) => {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (user.role === "admin") can("manage", "all");

  if (user.role === "manager") {
    console.log("manager");
    can("manage", "registryUser");
    can("read", "confirmedUser");
    can("update", "confirmedUser", {
      ownerId: user.id,
    });
    can("delete", "confirmedUser", { ownerId: user.id });
  }

  if (user.role === "user") {
    can("read", "confirmedUser");
    can("read", "registryUser");
  }
  return build();
};

const owner = { id: 1, role: "manager" };
const ability = defineAbility(owner);

// class confirmedUser {
//   constructor(ownerId) {
//     this.ownerId = ownerId;
//   }
// }
// const somePost = new confirmedUser(1);
// console.log(somePost);

console.log(ability.can("update", "registryUser"));
