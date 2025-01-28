import toast from "react-hot-toast";

import ToastError from "../basic1/ToastError";
import dayjs from "dayjs";

export function onError() {
  return toast.custom(<ToastError>Missing Field(s).</ToastError>);
}

export function resetDate() {
  return { startDate: null, endDate: null };
}

export function setDate(data, item) {
  return {
    startDate: dayjs(data.data[item]).$d,
    endDate: dayjs(data.data[item]).$d,
  };
}

export function setItem(data, item) {
  return { value: data.data[item], label: data.data[item] };
}

export function trimStrings(obj) {
  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = obj[key].trim();
    }
  }
  return obj;
}

// export class OnSubmitForm {
//   constructor(data) {
//     this.data = trimStrings(data);
//   }
//   async file() {
//     const finalData = new FormData();
//     for (const key in this.data) {
//       if (typeof this.data[key] === "object") {
//         finalData.append(key, this.data[key][0]);
//       } else {
//         finalData.append(key, this.data[key]);
//       }
//     }
//     return finalData;
//   }
//   async text() {
//     return this.data;
//   }
//   async timelogUp() {
//     return convertToJson(this.data.file[0]);
//   }
// }

export async function onSubmitForm(data, dataType) {
  const trimmedData = trimStrings(data);

  if (dataType === "file") {
    const finalData = new FormData();
    for (const key in trimmedData) {
      if (typeof trimmedData[key] === "object") {
        finalData.append(key, trimmedData[key][0]);
      } else {
        finalData.append(key, trimmedData[key]);
      }
    }
    return finalData;
  }
  if (dataType === "text") return trimmedData;
  if (dataType === "timelog") return convertToJson(data.file[0]);
}

function convertToJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const content = e.target.result;
      const lines = content.split("\n");
      const newArray = lines.map((element) => element.replace("\r", ""));
      const headers = newArray.map((element) => element.split("\t"));
      const jsonData = headers.map((row) => {
        const obj = {};
        row.forEach((value, i) => {
          const key = headers[0][i];
          obj[key] = value;
        });
        return obj;
      });
      const reName = jsonData.map(({ No, dataId, Name, Mode, DateTime }) => ({
        uniqueData: No,
        dataId: dataId,
        name: Name,
        mode: Mode,
        dateTime: DateTime,
      }));

      resolve(reName.splice(1, jsonData.length - 2));
    };

    reader.onerror = function (e) {
      reject(e);
    };

    reader.readAsText(file);
  });
}
