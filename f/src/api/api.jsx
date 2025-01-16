import axios from "axios";
import toast from "react-hot-toast";
import io from "socket.io-client";

import ToastSuccess from "../reusable/components/basic1/ToastSuccess";
import ToastError from "../reusable/components/basic1/ToastError";
import { f2bFormat } from "../reusable/hooks/useHook1";

const bServer = "http://localhost:8000";

const apiClient = axios.create({
  baseURL: bServer,
  timeout: 1000,
});

export const fSocket = io.connect(bServer);

//first happening sending data to BE
function f2bFx(url, data) {
  const f2b = f2bFormat(url);
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

export async function get(url, user) {
  try {
    if (user !== "Guest") {
      authenticate(user);
      const data = await apiClient.get(url);
      f2bFx(url, data);
      return data;
    }
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}

export async function post(url, data) {
  try {
    const rs = await apiClient.post(url, data);
    f2bFx(url, rs);
    toast.custom(<ToastSuccess>Saved successfully</ToastSuccess>);
    return rs;
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}

export async function patch(url, data) {
  try {
    const rs = await apiClient.patch(url, data);
    f2bFx(url, rs);
    toast.custom(<ToastSuccess>Edited successfully</ToastSuccess>);
    return rs;
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}

export async function remove(url) {
  try {
    const rs = await apiClient.delete(url);
    f2bFx(url, rs);
    toast.custom(<ToastSuccess>Deleted successfully</ToastSuccess>);
    return rs;
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}

function authenticate(user) {
  apiClient.interceptors.request.use(
    (config) => {
      const dataDetails = localStorage.getItem(user);
      if (dataDetails) {
        const token = JSON.parse(dataDetails).token;
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err) => Promise.reject(err),
  );
}

export async function login(url, data, navigate, userSet) {
  try {
    const rs = await apiClient.post(url, data);
    toast.custom(<ToastSuccess>Logged In successfully</ToastSuccess>);
    const { dataDetails } = rs.data;
    userSet(dataDetails.username);
    localStorage.setItem(dataDetails.username, JSON.stringify(dataDetails));
    navigate("/Homepage");
    return rs;
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}

export async function logout(navigate, userSet, user) {
  console.log(user);
  try {
    localStorage.removeItem(user);
    user !== "Guest" &&
      toast.custom(<ToastSuccess>Logged Out successfully</ToastSuccess>);
    navigate("/homepage/login");
    userSet("Guest");
  } catch (exception) {
    return DataHandler.ifError(exception);
  }
}
