"use strict";

import { Server } from "socket.io";

import { urlArr } from "../routes.js";
import { deleteImage, fileUrl } from "../../utils/bHelpers.js";

export function socketServer(socketServe) {
  const io = new Server(socketServe, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  //second happening, sending data back to FE
  io.on("connection", (socket) => {
    const events = urlArr.map(
      (item) => item.url.replace("/", "").split("/")[0]
    );

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
    deleteImage(rq.file?.path);
    return rs.status(500).send(error.message);
  }
  static duplicatedEntry(rq, rs, duplicate) {
    deleteImage(rq.file?.path);
    return DataHandler.conflict(rs, duplicate);
  }
  static conflict(rs, duplicate) {
    return rs.status(409).send(`Duplicate Item exist: "${duplicate}"`);
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

export async function registryUserBEPostCustom(rq, rs, model, folderLoc) {
  try {
    const { email } = rq.body;

    //check if email exist and delete image
    const userEmailExist = await model.exists({ email });
    if (userEmailExist) return DataHandler.duplicatedEntry(rq, rs, email);
    //check if email exist and delete image

    const data = await model.create({
      ...rq.body,
      image: rq.file?.filename && fileUrl(`${folderLoc}/`) + rq.file.filename,
    });
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}
