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
  static isFound(rs, data) {
    return rs.status(200).send(data);
  }
  static authenticate(rs, data) {
    const token = jwt.sign(
      { objId: data._id, username: data.username, role: data.roleSelect },
      process.env.TOKEN_KEY,
      {
        expiresIn: "4h",
      }
    );

    return rs.status(201).json({
      dataDetails: {
        username: data.username,
        role: data.roleSelect,
        image: data.file,
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
  static secure(rq, rs, username, password, confirmPassword) {
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
    const data = await model.findById(id).populate("weeklySchedule");
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function getOP(rq, rs, model, populate) {
  try {
    const { id } = rq.params;
    const data = await model.findById(id).populate(populate);
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function getGroup(rq, rs, model) {
  try {
    const { id } = rq.params;
    const data = await model.find({ dataId: { $in: id } });
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

export async function postOne(rq, rs, model) {
  try {
    const data = await model.create(rq.body);
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function postUnique(rq, rs, model) {
  try {
    const prevData = await model.find();
    const isArray = Array.isArray(rq.body);
    const req = isArray ? rq.body : [rq.body];

    const filteredDataOfNewAndPrev = req.filter(
      (newItem) =>
        !prevData.some((prevItem) => prevItem.uniqueData === newItem.uniqueData)
    );
    const filteredData = filteredDataOfNewAndPrev.reduce((acc, current) => {
      if (!acc.find((item) => item.uniqueData === current.uniqueData)) {
        acc.push(current);
      }
      return acc;
    }, []);
    const data = await model.insertMany(filteredData);

    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function patchFile(rq, rs, model, folderName) {
  try {
    const { id } = rq.params;
    console.log(id);

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

    if (!username || !password) {
      return DataHandler.secure(rq, rs, username, password, confirmPassword);
    }

    if (password !== confirmPassword) {
      return DataHandler.secure(rq, rs, username, password, confirmPassword);
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

export async function removeOne(rq, rs, model) {
  try {
    const { id } = rq.params;

    const data = await model.findByIdAndDelete(id);
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

export async function removeFanDData(
  rq,
  rs,
  model,
  folderName,
  modelToBeRemoveObj,
  modelDataToBeRemoveObj = []
) {
  try {
    const { id } = rq.params;
    //userPrevFile
    const user = await model.findById(id);
    if (!user) return DataHandler.dataNotFound(rq, rs);
    DataHandler.delPrevFile(folderName, user.file);
    //userPrevFile
    const data = await model.findByIdAndDelete(id);
    modelToBeRemoveObj.forEach(async (obj) => {
      await obj.model.findByIdAndDelete(user[obj.entry]);
    });
    modelDataToBeRemoveObj.forEach(async (obj) => {
      await obj.deleteMany({ dataId: data.dataId });
    });
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function transferOne(
  rq,
  rs,
  model,
  modelToBeTransfer,
  modelToBeAddedObj
) {
  try {
    const { id } = rq.params;

    const modelToTransfer = await modelToBeTransfer.findById(id);
    if (!modelToTransfer) return DataHandler.dataNotFound(rq, rs);
    const modelToTransferLean = modelToTransfer.toObject();

    const addedObjects = await Promise.all(
      modelToBeAddedObj.map(async (obj) => {
        const addedObj = await obj.model.create({});
        return { [obj.entry]: String(addedObj._id) };
      })
    );

    const data = await model.create({
      ...modelToTransferLean,
      ...addedObjects.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    });
    if (data) await modelToBeTransfer.findByIdAndDelete(id);
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function loginFile(rq, rs, model) {
  try {
    const { username, password, confirmPassword } = rq.body;

    const data = await model.findOne({ username });

    if (data && (await bcrypt.compare(password, data.password))) {
      return DataHandler.authenticate(rs, data);
    }

    if (!username || !password) {
      return DataHandler.secure(rq, rs, username, password, confirmPassword);
    }

    if (password !== confirmPassword) {
      return DataHandler.secure(rq, rs, username, password, confirmPassword);
    }

    return rs.status(400).send("Invalid credentials. Please try again.");
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}

export async function patchOne(rq, rs, model) {
  try {
    const { id } = rq.params;

    const data = await model.findByIdAndUpdate(id, rq.body, {
      new: true,
    });
    console.log(data);
    return DataHandler.isFound(rs, data);
  } catch (error) {
    return DataHandler.ifError(rq, rs, error);
  }
}
