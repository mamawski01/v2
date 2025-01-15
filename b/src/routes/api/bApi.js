"use strict";

import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

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
  static isFound(rs, data) {
    return rs.status(200).send(data);
  }
  static authenticate(rs, data) {
    const token = jwt.sign(
      { objId: data._id, username: data.username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "4h",
      }
    );

    return rs.status(201).json({
      dataDetails: {
        username: data.username,
        token,
      },
    });
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

export async function transferOne(
  rq,
  rs,
  model,
  collectionName,
  modelToBeTransfer,
  modelToBeAddedObj
) {
  try {
    const { id } = rq.params;

    const modelToTransfer = await modelToBeTransfer.findById(id);
    if (!modelToTransfer) return DataHandler.dataNotFound(rq, rs);
    const modelToTransferLean = modelToTransfer.toObject();

    const modelToAddedObj = await modelToBeAddedObj.model.create({
      firstName: modelToTransferLean.firstName,
      middleName: modelToTransferLean.middleName,
      lastName: modelToTransferLean.lastName,
    });
    const data = await model.create({
      ...modelToTransferLean,
      dataId: uuidv4({ namespace: collectionName }),
      weeklySchedule: modelToAddedObj._id,
    });
    console.log(data);
    if (data) await modelToBeTransfer.findByIdAndDelete(id);
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function loginFile(rq, rs, model) {
  try {
    const { username, password } = rq.body;

    const data = await model.findOne({ username });

    if (data && (await bcrypt.compare(password, data.password))) {
      return DataHandler.authenticate(rs, data);
    }

    return rs.status(400).send("Invalid credentials. Please try again.");
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function postOne(rq, rs, model) {
  try {
    const data = await model.create(rq.body);
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}
