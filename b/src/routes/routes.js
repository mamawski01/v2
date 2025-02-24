"use strict";
import express from "express";
import jwt from "jsonwebtoken";

import {
  deleteFile,
  getAll,
  getGroup,
  getLocal,
  getOne,
  getOP,
  getUrl,
  loginFile,
  patchFile,
  patchOne,
  patchPasswordFile,
  postFile,
  postOne,
  postUnique,
  postUXC,
  removeFanDData,
  removeOne,
  transferOne,
} from "./api/bApi.js";
import { upload } from "../utils/multer.js";
import RegistryUserModel from "./api/models/RegistryUserModel.js";
import ConfirmedUserModel from "./api/models/ConfirmedUserModel.js";
import WeeklyUserScheduleModel from "./api/models/WeeklyUserScheduleModel.js";
import {
  camelCaseToSingleWord,
  eventsFormatter,
  defineAbility,
} from "./rolePermission.js";
import UserScheduleModel from "./api/models/UserScheduleModel.js";
import UserTimelogModel from "./api/models/UserTimelogModel.js";
import UserFinalTimelogModel from "./api/models/UserFinalTimelogModel.js";
import UserEventModel from "./api/models/UserEventModel.js";
import UserWageModel from "./api/models/UserWageModel.js";
import { wageRate } from "./api/models/wageRate.js";
import UserPayrollModel from "./api/models/UserPayrollModel.js";

export const routes = express.Router();

export const urlArr = [
  //url
  { url: "/systemUrl/getException" },
  // registryUser
  { url: "/registryUser/getAll", model: RegistryUserModel },
  { url: "/registryUser/getOne/:id", model: RegistryUserModel },
  {
    url: "/registryUser/postFile",
    model: RegistryUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/registryUser/patchFile/:id",
    model: RegistryUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/registryUser/deleteFile/:id",
    model: RegistryUserModel,
    folderName: "userImgFol",
  },
  //confirmedUser
  { url: "/confirmedUser/getAll", model: ConfirmedUserModel },
  {
    url: "/confirmedUser/getOne/:id",
    model: ConfirmedUserModel,
  },
  {
    url: "/registryUserToConfirmedUser/transferOne/:id",
    model: ConfirmedUserModel,
    modelToBeTransfer: RegistryUserModel,
    modelToBeAddedObj: [
      {
        model: WeeklyUserScheduleModel,
        entry: "weeklySchedule",
      },
    ],
  },
  {
    url: "/confirmedUser/patchPasswordFile/:id",
    model: ConfirmedUserModel,
    folderName: "userImgFol",
    fileName: "userImg",
  },
  {
    url: "/confirmedUser/removeFanDData/:id",
    model: ConfirmedUserModel,
    folderName: "userImgFol",
    modelToBeRemoveObj: [
      {
        model: WeeklyUserScheduleModel,
        entry: "weeklySchedule",
      },
    ],
    modelDataToBeRemoveObj: [
      UserScheduleModel,
      UserTimelogModel,
      UserFinalTimelogModel,
      UserEventModel,
      UserWageModel,
      UserPayrollModel,
    ],
  },
  {
    url: "/confirmedUser/loginFile",
    model: ConfirmedUserModel,
  },
  //weeklySchedule
  {
    url: "/weeklySchedule/getOne/:id",
    model: WeeklyUserScheduleModel,
  },
  {
    url: "/weeklySchedule/patchOne/:id",
    model: WeeklyUserScheduleModel,
  },
  //confirmUser
  {
    url: "/confirmedUser/getOP/:id",
    model: ConfirmedUserModel,
    populate: ["weeklySchedule"],
  },
  //userSchedule
  {
    url: "/userSchedule/getOne/:id",
    model: UserScheduleModel,
  },
  {
    url: "/userSchedule/getGroup/:id",
    model: UserScheduleModel,
  },
  {
    url: "/userSchedule/postUnique",
    model: UserScheduleModel,
  },
  {
    url: "/userSchedule/patchOne/:id",
    model: UserScheduleModel,
  },
  {
    url: "/userSchedule/removeOne/:id",
    model: UserScheduleModel,
  },
  //userTimelog
  {
    url: "/userTimelog/getOne/:id",
    model: UserTimelogModel,
  },
  {
    url: "/userTimelog/getGroup/:id",
    model: UserTimelogModel,
  },
  {
    url: "/userTimelog/postUXC",
    model: UserTimelogModel,
    modelToHaveExtraCopy: [UserFinalTimelogModel],
  },
  //userFinalTimelog
  {
    url: "/userFinalTimelog/getOne/:id",
    model: UserFinalTimelogModel,
  },
  {
    url: "/userFinalTimelog/getGroup/:id",
    model: UserFinalTimelogModel,
  },
  {
    url: "/userFinalTimelog/patchOne/:id",
    model: UserFinalTimelogModel,
  },
  {
    url: "/userFinalTimelog/removeOne/:id",
    model: UserFinalTimelogModel,
  },
  //userEvent
  {
    url: "/userEvent/getOne/:id",
    model: UserEventModel,
  },
  {
    url: "/userEvent/getGroup/:id",
    model: UserEventModel,
  },
  {
    url: "/userEventAll/getGroup/:id",
    model: UserEventModel,
  },
  {
    url: "/userEvent/postOne",
    model: UserEventModel,
  },
  {
    url: "/userEvent/patchOne/:id",
    model: UserEventModel,
  },
  {
    url: "/userEvent/removeOne/:id",
    model: UserEventModel,
  },
  //userWage
  {
    url: "/userWage/getGroup/:id",
    model: UserWageModel,
  },
  {
    url: "/userWage/postOne",
    model: UserWageModel,
  },
  {
    url: "/userWage/patchOne/:id",
    model: UserWageModel,
  },
  //wageRate
  {
    url: "/wageRate/getLocal",
    model: wageRate,
  },
  //userPayroll
  {
    url: "/userPayroll/getOne/:id",
    model: UserPayrollModel,
  },
  {
    url: "/userPayroll/getGroup/:id",
    model: UserPayrollModel,
  },
  {
    url: "/userPayroll/postUnique",
    model: UserPayrollModel,
  },
  {
    url: "/userPayroll/patchOne/:id",
    model: UserPayrollModel,
  },
  {
    url: "/userPayroll/removeOne/:id",
    model: UserPayrollModel,
  },
  //sala
  {
    url: "/userFinalTimelog/postUnique",
    model: UserFinalTimelogModel,
  },
];

//for systemUrl
export const urlEvents = urlArr.map((item) => item.url);

//for socket io
export const events = eventsFormatter(urlEvents);

urlArr.forEach((item) => {
  if (item.url.includes("getException")) {
    routes.get(item.url, (rq, rs) => getUrl(rq, rs));
  }
  if (item.url.includes("getLocal")) {
    routes.get(item.url, verifyToken, (rq, rs) => getLocal(rq, rs, item.model));
  }
  if (item.url.includes("getAll")) {
    routes.get(item.url, verifyToken, (rq, rs) => getAll(rq, rs, item.model));
  }
  if (item.url.includes("getOne")) {
    routes.get(item.url, verifyToken, (rq, rs) => getOne(rq, rs, item.model));
  }
  if (item.url.includes("getGroup")) {
    routes.get(item.url, verifyToken, (rq, rs) => getGroup(rq, rs, item.model));
  }
  if (item.url.includes("getOP")) {
    routes.get(item.url, verifyToken, (rq, rs) =>
      getOP(rq, rs, item.model, item.populate)
    );
  }
  if (item.url.includes("postFile")) {
    routes.post(
      item.url,
      verifyToken,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => postFile(rq, rs, item.model, item.folderName)
    );
  }
  if (item.url.includes("postOne")) {
    routes.post(item.url, verifyToken, (rq, rs) => {
      postOne(rq, rs, item.model);
    });
  }
  if (item.url.includes("postUnique")) {
    routes.post(item.url, verifyToken, (rq, rs) => {
      postUnique(rq, rs, item.model);
    });
  }
  if (item.url.includes("postUXC")) {
    routes.post(item.url, verifyToken, (rq, rs) => {
      postUXC(rq, rs, item.model, item.modelToHaveExtraCopy);
    });
  }
  if (item.url.includes("patchFile")) {
    routes.patch(
      item.url,
      verifyToken,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => patchFile(rq, rs, item.model, item.folderName)
    );
  }
  if (item.url.includes("patchPasswordFile")) {
    routes.patch(
      item.url,
      verifyToken,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => patchPasswordFile(rq, rs, item.model, item.folderName)
    );
  }
  if (item.url.includes("removeOne")) {
    routes.delete(item.url, verifyToken, (rq, rs) => {
      removeOne(rq, rs, item.model);
    });
  }
  if (item.url.includes("deleteFile")) {
    routes.delete(item.url, verifyToken, (rq, rs) => {
      deleteFile(rq, rs, item.model, item.folderName);
    });
  }
  if (item.url.includes("removeFanDData")) {
    routes.delete(item.url, verifyToken, (rq, rs) => {
      removeFanDData(
        rq,
        rs,
        item.model,
        item.folderName,
        item.modelToBeRemoveObj,
        item.modelDataToBeRemoveObj
      );
    });
  }
  if (item.url.includes("transferOne")) {
    routes.post(item.url, verifyToken, (rq, rs) => {
      transferOne(
        rq,
        rs,
        item.model,
        item.modelToBeTransfer,
        item.modelToBeAddedObj
      );
    });
  }
  if (item.url.includes("loginFile")) {
    routes.post(
      item.url,
      upload(item.folderName, item.fileName).single("file"),
      (rq, rs) => {
        loginFile(rq, rs, item.model);
      }
    );
  }

  if (item.url.includes("patchOne")) {
    routes.patch(item.url, verifyToken, (rq, rs) => {
      patchOne(rq, rs, item.model);
    });
  }
});

function verifyToken(rq, rs, nxt) {
  let token = rq.body.token || rq.query.token || rq.headers["authorization"];

  if (!token)
    return rs.status(401).send("Token is required for authentication.");

  try {
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    rq.dataToken = decoded;
    rq.role = decoded.role;

    const url = camelCaseToSingleWord(eventsFormatter([rq.url])[0]);

    const dataId = rq.url.split("/").pop();

    const owner = {
      id: rq.dataToken.objId,
      role: rq.role,
      fileId: dataId,
    };

    const ability = defineAbility(owner);

    if (ability.can(methodToAction[rq.method], url)) {
      return nxt();
    } else {
      return rs.status(403).send("Forbidden");
    }
  } catch (error) {
    return rs.status(401).send("Invalid Token, " + error);
  }
}

const methodToAction = {
  GET: "read",
  POST: "create",
  PATCH: "update",
  DELETE: "delete",
};
