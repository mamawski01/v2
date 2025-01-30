import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Joi from "joi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { fSocket, get } from "../../api/api";
import { schemaResult } from "../../lib/joiValidator";
import { useGlobal } from "../../context/globalHook";

async function fetchData() {
  try {
    const response = await fetch(
      "http://localhost:8000/systemUrl/getException",
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
const urlData = await fetchData();

const events = urlData?.events && urlData?.events;
export const urlEvents = urlData?.urlEvents?.length > 0 && urlData.urlEvents;

// console.log(urlEvents);
// console.log(events);

export const dummyUrl = "/dummy/duh";
export const registryUserGetAll = colonRemove(urlEvents[1]);
export const registryUserGetOne = colonRemove(urlEvents[2]);
export const registryUserPostFile = colonRemove(urlEvents[3]);
export const registryUserPatchFile = colonRemove(urlEvents[4]);
export const registryUserRemoveFile = colonRemove(urlEvents[5]);
export const confirmedUserGetAll = colonRemove(urlEvents[6]);
export const confirmedUserGetOne = colonRemove(urlEvents[7]);
export const registryUserToConfirmedUserTransferOne = colonRemove(urlEvents[8]);
export const confirmedUserPatchFile = colonRemove(urlEvents[9]);
export const confirmedUserRemoveFile = colonRemove(urlEvents[10]);
export const confirmedUserLoginFile = colonRemove(urlEvents[11]);
export const weeklyScheduleGetOne = colonRemove(urlEvents[12]);
export const weeklySchedulePatch = colonRemove(urlEvents[13]);
export const confirmedUserGetOP = colonRemove(urlEvents[14]);
export const userScheduleGetOne = colonRemove(urlEvents[15]);
export const userScheduleGetGroup = colonRemove(urlEvents[16]);
export const userSchedulePostUnique = colonRemove(urlEvents[17]);
export const userSchedulePatchOne = colonRemove(urlEvents[18]);
export const userScheduleRemoveOne = colonRemove(urlEvents[19]);
export const userTimelogGetOne = colonRemove(urlEvents[20]);
export const userTimelogGetGroup = colonRemove(urlEvents[21]);
export const userTimelogPostUnique = colonRemove(urlEvents[22]);
export const userFinalTimelogGetOne = colonRemove(urlEvents[23]);
export const userFinalTimelogGetGroup = colonRemove(urlEvents[24]);
export const userFinalTimelogPatchOne = colonRemove(urlEvents[25]);
export const userFinalTimelogRemoveOne = colonRemove(urlEvents[26]);
export const userEventGetOne = colonRemove(urlEvents[27]);
export const userEventGetGroup = colonRemove(urlEvents[28]);
export const userEventGetGroupAll = colonRemove(urlEvents[29]);
export const userEventPostOne = colonRemove(urlEvents[30]);
export const userEventPatchOne = colonRemove(urlEvents[31]);
export const userEventRemoveOne = colonRemove(urlEvents[32]);
export const userWageGetGroup = colonRemove(urlEvents[33]);
export const userWagePostOne = colonRemove(urlEvents[34]);
export const userWagePatchOne = colonRemove(urlEvents[35]);
export const wageRateGetLocal = colonRemove(urlEvents[36]);
export const userPayrollGetOne = colonRemove(urlEvents[37]);
export const userPayrollGetGroup = colonRemove(urlEvents[38]);
export const userPayrollPostUnique = colonRemove(urlEvents[39]);
export const userPayrollPatchOne = colonRemove(urlEvents[40]);
export const userPayrollRemoveOne = colonRemove(urlEvents[41]);
export const userFinalTimelogPostUnique = colonRemove(urlEvents[42]);

function colonRemove(url) {
  return url.split(":")[0];
}

export function f2bFormat(url) {
  const firstWord = url.split("/")[1];
  const secondWord =
    url.split("/")[2].charAt(0).toUpperCase() + url.split("/")[2].slice(1);
  return firstWord + secondWord;
}

export function useFetch(url, edit = true, form = false) {
  const { user } = useGlobal();
  const navigate = useNavigate();
  //params check
  const schema = Joi.object({
    url: Joi.string().required(),
    edit: Joi.bool().required(),
  }).validate({ url, edit });
  schemaResult(schema);
  //params check
  const f2b = f2bFormat(url);
  const { data, refetch, isFetching } = useQuery({
    queryKey: [f2b],
    queryFn: async () => {
      return edit && user.token !== undefined && get(url, user, navigate);
    },
  });
  const [apiData, apiDataSet] = useState();
  //last happening consuming data from BE
  if (!form) {
    let arr = [];
    const sameUrl = url.split("/")[1];
    if (events) {
      events.forEach((item) => {
        if (
          item !== f2b &&
          item.toLowerCase().includes(sameUrl.toLowerCase())
        ) {
          arr.push(item);
          fSocket.on(`${item}B2F`, (data) => {
            apiDataSet(data);
          });
        }
      });
      arr.length > 7 && console.log("Must less than 7. Just check here.");
    }
  }

  useEffect(() => {
    refetch();
  }, [refetch, apiData]);
  return { data, isFetching };
}

export function usePreFetch(arr) {
  const { user } = useGlobal();
  const navigate = useNavigate();
  //params check
  const schema = Joi.object({
    arr: Joi.array().items(Joi.string()).required(),
  }).validate({ arr });
  schemaResult(schema);
  //params check
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user.token !== undefined) {
      arr.forEach((url) => {
        const f2b = f2bFormat(url);
        queryClient.prefetchQuery({
          queryKey: [f2b],
          queryFn: async () => {
            return get(url, user, navigate);
          },
        });
      });
    }
  }, [queryClient, arr, user, navigate]);
}

export function useMutate() {
  const { isPending, mutate } = useMutation({
    mutationFn: async (method) => {
      method;
    },
  });
  return { isPending, mutate };
}

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  function setValue(value) {
    try {
      setStoredValue(value);

      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return [storedValue, setValue];
}

export function useLocalStorageDate(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? dayjs(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  function setValue(value) {
    try {
      setStoredValue(value);

      if (typeof window !== "undefined") {
        localStorage.setItem(key, dayjs(value).format("YYYY-MM-DD"));
      }
    } catch (error) {
      console.log(error);
    }
  }

  return [storedValue, setValue];
}
