import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Joi from "joi";
import dayjs from "dayjs";

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
      return edit && get(url, user);
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
  //params check
  const schema = Joi.object({
    arr: Joi.array().items(Joi.string()).required(),
  }).validate({ arr });
  schemaResult(schema);
  //params check
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user !== "Guest") {
      arr.forEach((url) => {
        const f2b = f2bFormat(url);
        queryClient.prefetchQuery({
          queryKey: [f2b],
          queryFn: async () => {
            return get(url, user);
          },
        });
      });
    }
  }, [queryClient, arr, user]);
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
