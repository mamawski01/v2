import Joi from "joi";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import { StrPhrase } from "./utils0";
import { schemaResult } from "./joiValidator";

export function documentTitle() {
  const docTitle = StrPhrase.capEach1stLetter(
    location.pathname.split("/").slice(-1),
  )[0];

  const isMongoDbId = /^[a-f\d]{24}$/.test(docTitle);

  const finalDocTitle = isMongoDbId
    ? StrPhrase.capEach1stLetter(location.pathname.split("/").slice(-2))[0]
    : docTitle;
  const isConvertibleToNumber = !isNaN(parseFloat(finalDocTitle));
  const finalDocTitle2 = isConvertibleToNumber
    ? StrPhrase.capEach1stLetter(location.pathname.split("/").slice(-3))[0]
    : finalDocTitle;
  //go to index.html, edit the <title></title>
  const documentTitleStr = `${finalDocTitle2} | Tiberio Optical`;

  return (document.title = documentTitleStr);
}

export function calcAge(birthday) {
  //params check
  const schema = Joi.object({
    birthday: Joi.string().required(),
  }).validate({ birthday });
  schemaResult(schema);
  //params check

  const birthdate = dayjs(birthday);
  const currentDate = dayjs();
  const age = currentDate.diff(birthdate, "year");

  return age;
}

export function swalAlert(confirmButtonText = "Yes, delete it!") {
  //params check
  const schema = Joi.object({
    confirmButtonText: Joi.string(),
  }).validate({ confirmButtonText });
  schemaResult(schema);
  //params check

  const confirmDelete = Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#22C55E80",
    cancelButtonColor: "#B60909",
    confirmButtonText: confirmButtonText,
    customClass: {
      popup: "rounded bg-black/90 text-zinc-300 p-5 backdrop-blur-sm",
    },
  });
  const result = confirmDelete.then((result) => {
    if (result.isConfirmed) {
      let timerInterval;
      Swal.fire({
        title: "Deleted!",
        text: "Data has been deleted.",
        icon: "success",
        customClass: {
          popup: "rounded bg-black/90 text-zinc-300 p-5 backdrop-blur-sm",
        },
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
    }
    return result;
  });

  return result;
}
