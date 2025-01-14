"use strict";

import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { events, urlEvents } from "../routes.js";
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
  static async isFound(rs, data) {
    console.log(data);
    return rs.status(200).send(data);
  }
  static ifError(rq, rs, error) {
    removeFile(rq.file?.path);
    return rs.status(500).send(error.message || error);
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
    const fileUrl = file.substring(file.lastIndexOf("/") + 1);
    removeFile(fileLoc(folderName) + "/" + fileUrl);
  }
  static async uniqueDataId(rq, rs, model, dataId) {
    const dataIdExist = await model.exists({
      dataId,
    });
    if (dataIdExist) return DataHandler.duplicatedEntry(rq, rs, dataId);
  }
}

export async function getUrl(rq, rs) {
  try {
    const data = { urlEvents, events };
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
    const { id } = rq.body;

    //userPrevFile with rq.file?.filename
    const user = await model.findById(id);
    if (!user) return DataHandler.dataNotFound(rq, rs);
    rq.file?.filename && DataHandler.delPrevFile(folderName, user.file);
    //userPrevFile with rq.file?.filename

    const data = await model.findByIdAndUpdate(id, {
      ...rq.body,
      file: rq.file?.filename && fileUrl(`${folderName}/`) + rq.file.filename,
    });
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function patchPasswordFile(rq, rs, model, folderName) {
  try {
    const { id } = rq.params;
    const { username, password, confirmPassword } = rq.body;
    console.log(confirmPassword);

    if (!username || !password) {
      return DataHandler.ifError(rq, rs, "Username and password are required");
    }

    if (password !== confirmPassword) {
      return DataHandler.ifError(
        rq,
        rs,
        "Password and confirmPassword does not match"
      );
    }

    //userPrevFile with rq.file?.filename
    const user = await model.findById(id);
    if (!user) return DataHandler.dataNotFound(rq, rs);
    rq.file?.filename && DataHandler.delPrevFile(folderName, user.file);
    //userPrevFile with rq.file?.filename

    const encryptedPass = await bcrypt.hash(password, 10);

    const data = await model.findByIdAndUpdate(id, {
      ...rq.body,
      password: encryptedPass,
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

export async function transferOne(rq, rs, model, modelToBeTransfer) {
  try {
    const { id } = rq.params;

    const modelToReplace = await modelToBeTransfer.findById(id);
    if (!modelToReplace) return DataHandler.dataNotFound(rq, rs);

    const modelToReplaceLean = modelToReplace.toObject();
    const data = await model.create(modelToReplaceLean);
    if (data) await modelToBeTransfer.findByIdAndDelete(id);
    if (data) await data.save();
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function transferAuthenticate(rq, rs, model, modelToBeTransfer) {
  try {
    const { id } = rq.params;

    const modelToReplace = await modelToBeTransfer.findById(id);
    if (!modelToReplace) return DataHandler.dataNotFound(rq, rs);

    const modelToReplaceLean = modelToReplace.toObject();
    const data = await model.create(modelToReplaceLean);
    if (data) await modelToBeTransfer.findByIdAndDelete(id);
    if (data) await data.save();
    const token = jwt.sign(
      { objId: data._id, username: data.username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30m",
      }
    );

    // return rs.status(201).json({
    //   dataDetails: {
    //     username: data.username,
    //     token,
    //   },
    // });

    return DataHandler.isFound(rs, { token, data });
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}
