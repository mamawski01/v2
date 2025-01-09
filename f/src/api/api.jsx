import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

import ToastSuccess from "../reusable/components/basic1/ToastSuccess";
import ToastError from "../reusable/components/basic1/ToastError";

const bServer = "http://localhost:8000";

const apiClient = axios.create({
  baseURL: bServer,
  timeout: 1000,
});

export const fSocket = io.connect(bServer);

//first happening sending data to BE
function f2bFx(f2b, data) {
  fSocket.emit(`${f2b}F2B`, data);
}

class DataHandler {
  constructor() {}
  static ifError(exception, mess) {
    console.log(exception, mess);
    console.log(exception.response.data);
    toast.custom(<ToastError>{exception.response.data}</ToastError>);
    return exception.response.data;
  }
}

export async function get(url) {
  try {
    const data = await apiClient.get(url);
    const f2b = url.replace("/", "").split("/")[0];
    f2bFx(f2b, data);
    return data;
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}

export async function post(url) {
  try {
    const data = await apiClient.post(url);
    const f2b = url.replace("/", "").split("/")[0];
    f2bFx(f2b, data);
    toast.custom(<ToastSuccess>Saved successfully</ToastSuccess>);
    return data;
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}

export async function patch(url) {
  try {
    const data = await apiClient.patch(url);
    const f2b = url.replace("/", "").split("/")[0];
    f2bFx(f2b, data);
    toast.custom(<ToastSuccess>Edited successfully</ToastSuccess>);
    return data;
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}

export async function remove(url) {
  try {
    const data = await apiClient.delete(url);
    const f2b = url.replace("/", "").split("/")[0];
    f2bFx(f2b, data);
    toast.custom(<ToastSuccess>Deleted successfully</ToastSuccess>);
    return data;
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}
