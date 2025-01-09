"use strict";

import { Server } from "socket.io";

import { urlEvents } from "../routes.js";
import { removeFile, fileUrl } from "../../utils/bHelpers.js";
import { fileLoc } from "../../utils/multer.js";

export function socketServer(socketServe) {
  const io = new Server(socketServe, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  //second happening, sending data back to FE
  io.on("connection", (socket) => {
    const events = urlEvents.map((item) => item.replace("/", "").split("/")[0]);

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const { f2b, b2f } = { f2b: `${event}F2B`, b2f: `${event}B2F` };
      socket.on(f2b, (data) => {
        try {
          io.emit(b2f, data);
        } catch (error) {
          console.error(`Error emitting event ${b2f}: ${error}`);
        }
      });
    }
  });
}

class DataHandler {
  constructor() {}
  static isFound(rs, data) {
    return rs.status(200).send(data);
  }
  static ifError(rq, rs, error) {
    console.log(error);
    removeFile(rq.file?.path);
    return rs.status(500).send(error.message);
  }
  static duplicatedEntry(rq, rs, duplicate) {
    removeFile(rq.file?.path);
    return DataHandler.conflict(rs, duplicate);
  }
  static conflict(rs, duplicate) {
    return rs.status(409).send(`Duplicate Item exist: "${duplicate}"`);
  }
  static dataNotFound(rq, rs) {
    removeFile(rq.file?.path);
    return rs.status(404).send(`data not found.`);
  }
  static delPrevFile(folderName, file) {
    const imageUrl = file.substring(file.lastIndexOf("/") + 1);
    removeFile(fileLoc(folderName) + "/" + imageUrl);
  }
}

export async function getUrl(rq, rs) {
  try {
    const data = urlEvents;
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function getLocal(rq, rs, model) {
  try {
    const data = await model;
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function getAll(rq, rs, model) {
  try {
    const data = await model.find();
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function getOne(rq, rs, model) {
  try {
    const { id } = rq.params;
    const data = await model.findById(id);
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function postFile(rq, rs, model, folderName) {
  try {
    const data = await model.create({
      ...rq.body,
      file: rq.file?.filename && fileUrl(`${folderName}/`) + rq.file.filename,
    });
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function patchFile(rq, rs, model, folderName) {
  try {
    const { id, dataId = "" } = rq.params;
    //userPrevFile with rq.file?.filename
    const user = await model.findById(id);
    if (!user) return DataHandler.dataNotFound(rq, rs);
    rq.file?.filename && DataHandler.delPrevFile(folderName, user.file);
    //userPrevFile with rq.file?.filename

    //check if dataId exist and delete image, dataId must be unique
    const dataIdExist = await model.exists({
      dataId,
    });
    if (dataIdExist) return DataHandler.duplicatedEntry(rq, rs, dataIdExist);
    //check if dataId exist and delete image, dataId must be unique
    const data = await model.create({
      ...rq.body,
      file: rq.file?.filename && fileUrl(`${folderName}/`) + rq.file.filename,
    });
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function deleteFile(rq, rs, model, folderName) {
  try {
    const { id } = rq.params;
    //userPrevFile
    const user = await model.findById(id);
    if (!user) return DataHandler.dataNotFound(rq, rs);
    DataHandler.delPrevFile(folderName, user.file);
    //userPrevFile
    const data = await model.findByIdAndDelete(id);
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function replaceOne(rq, rs, model, modelToBeReplaced) {
  try {
    const { id, dataId } = rq.params;
    const modelToReplace = await modelToBeReplaced.findById(id);
    if (!modelToReplace) DataHandler.dataNotFound(rq, rs);

    //check if dataId exist and delete image, dataId must be unique
    const dataIdExist = await model.exists({
      dataId,
    });
    if (dataIdExist) return DataHandler.duplicatedEntry(rq, rs, dataIdExist);
    //check if dataId exist and delete image, dataId must be unique

    await modelToBeReplaced.findByIdAndDelete(id);
    const modelToReplaceLean = modelToReplace.toObject();
    const data = await model.create(modelToReplaceLean);
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}
