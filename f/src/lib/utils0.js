// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";
import Joi from "joi";
import { schemaResult } from "./joiValidator";
import dayjs from "dayjs";

// export function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

export class StrPhrase {
  constructor() {}
  static capEach1stLetter(arr) {
    //params check
    const schema = Joi.object({
      arr: Joi.array().items(Joi.string()).required(),
    }).validate({ arr });
    schemaResult(schema);
    //params check

    return arr.map((item) => item.charAt(0).toUpperCase() + item.slice(1));
  }
}

// class UniqueOnly {
//   constructor() {
//     this.items = new Set();
//   }
//   addItem(item) {
//     this.items.add(item);
//   }
//   getItems() {
//     return [...new Set(this.items)];
//   }
// }

// export const uniqueOnly = new UniqueOnly();

export function timeArr(dayOff = true) {
  let timeArray = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      let period = hour < 12 ? "am" : "pm";
      let hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      let time = `${hour12.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`;
      timeArray.push(time);
    }
  }
  return dayOff ? ["day-off", ...timeArray] : timeArray;
}

export function isValidDate(date) {
  const isValid = dayjs(date, "YYYY-MM-DD HH:mm:ss", true).isValid();
  if (isValid) return isValid;
  else throw new Error(`Invalid Date: ${date}`);
}

export function isValidDate2(date) {
  const isValid = dayjs(date, "YYYY-MM-DD HH:mm:ss").isValid();
  if (isValid) return isValid;
  else throw new Error(`Invalid Date: ${date}`);
}

export function formatDate(date) {
  isValidDate2(date);
  return dayjs(date).format("YYYY-MM-DD");
}
export function formatName(firstName, lastName, dataId) {
  //params check
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dataId: Joi.string().required(),
  }).validate({ firstName, lastName, dataId });
  schemaResult(schema);
  //params check
  return `${firstName} ${lastName}, dataId: ${dataId}`;
}
