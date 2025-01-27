// import { clsx } from "clsx";
// import { twMerge } from "tailwind-merge";
import Joi from "joi";
import { schemaResult } from "./joiValidator";
import dayjs from "dayjs";
import numeral from "numeral";

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

export function timeDiff(time1, time2) {
  if (isValidDate(time1) || isValidDate(time2)) {
    const timeDiff = dayjs.duration(dayjs(time1).diff(time2));
    return timeDiff;
  } else throw new Error("Invalid Date");
}

export function pureTimeAdder(iniTime, ...accTimes) {
  if (isValidDate2(iniTime)) {
    const [date, timeStr] = iniTime.split(" ");
    const [years, months, days] = date.split("-");
    const [hour, minute, second] = timeStr.split(":");

    const durations = [
      dayjs.duration({
        seconds: second,
        minutes: minute,
        hours: hour,
        days: days,
        months: months,
        years: years,
      }),
    ];
    accTimes.forEach((accTime) => {
      const [dateAcc, timeStrAcc] = accTime.split(" ");
      const [yearsAcc, monthsAcc, daysAcc] = dateAcc.split("-");
      const [hourAcc, minuteAcc, secondAcc] = timeStrAcc.split(":");
      durations.push(
        dayjs.duration({
          seconds: secondAcc,
          minutes: minuteAcc,
          hours: hourAcc,
          days: daysAcc,
          months: monthsAcc,
          years: yearsAcc,
        }),
      );
    });

    return durations.reduce((a, b) => a.add(b));
  }
}

export function formatDate(date) {
  isValidDate2(date);
  return dayjs(date).format("YYYY-MM-DD");
}

export function formatDateUsable(date) {
  isValidDate2(date);
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}

export function formatDateComplete(date) {
  isValidDate2(date);
  return dayjs(date).format("YYYY MMMM DD, dddd");
}

export function formatDateIncomplete(date) {
  isValidDate2(date);
  return dayjs(date).format("YYYY MMMM, DD");
}

export function formatTime(date) {
  isValidDate2(date);
  return dayjs(date).format("hh:mm:ss a");
}

export function formatTime_hhmm_a(date) {
  isValidDate2(date);
  return dayjs(date).format("hh:mm a");
}

export function formatTime_hhmm_ss(date) {
  isValidDate2(date);
  return dayjs(date).format("hh:mm:ss");
}

export function formatTime_HHmm_ss(date) {
  isValidDate2(date);
  return dayjs(date).format("HH:mm:ss");
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

export function toNumb(val) {
  return numeral(val).value();
}

export function toPeso(val) {
  return `₱ ${numeral(val).format("0,0.00")}`;
}

export function twoDecimal(val) {
  return numeral(val).format("0.00");
}
