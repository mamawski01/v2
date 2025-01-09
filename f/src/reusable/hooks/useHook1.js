import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Joi from "joi";

import { fSocket, get } from "../../api/api";
import { schemaResult } from "../../lib/joiValidator";
import dayjs from "dayjs";

export const { data: urlData } = await get("/getUrl");
const urlArr = urlData.map((url) => url.replace("/", "").split("/")[0]);

// export function useGet(b2f) {
//   //params check
//   const schema = Joi.object({
//     b2f: Joi.string().required(),
//   }).validate({ b2f });
//   schemaResult(schema);
//   //params check
//   //last happening consuming data from BE
//   const [apiData, apiDataSet] = useState();
//   fSocket.on(`${b2f}B2F`, (data) => {
//     console.log(data);
//     apiDataSet(data);
//   });
//   return apiData;
// }

export function useFetch(url, edit = true, form = false) {
  //params check
  const schema = Joi.object({
    url: Joi.string().required(),
    edit: Joi.bool().required(),
  }).validate({ url, edit });
  schemaResult(schema);
  //params check
  const f2b = url.replace("/", "").split("/")[0];
  const { data, refetch, isFetching } = useQuery({
    queryKey: [f2b],
    queryFn: async () => {
      return edit && get(url);
    },
  });

  const [apiData, apiDataSet] = useState(false);

  //last happening consuming data from BE
  if (form) {
    urlArr.forEach((item) => {
      if (item !== f2b) {
        fSocket.on(`${item}B2F`, () => {
          apiDataSet(true);
        });
      }
    });
  }
  useEffect(() => {
    refetch();
  }, [refetch, apiData]);
  return { data, isFetching };
}

export function usePreFetch(arr) {
  //params check
  const schema = Joi.object({
    arr: Joi.array().items(Joi.string()).required(),
  }).validate({ arr });
  schemaResult(schema);
  //params check
  const queryClient = useQueryClient();

  useEffect(() => {
    arr.forEach((url) => {
      const f2b = url.replace("/", "").split("/")[0];
      queryClient.prefetchQuery({
        queryKey: [f2b],
        queryFn: async () => {
          return get(url);
        },
      });
    });
  }, [queryClient, arr]);
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
