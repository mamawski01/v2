import PropTypes from "prop-types";
import dayjs from "dayjs";

import { GlobalContext } from "./GlobalContext";
import { urlEvents, useLocalStorage } from "../reusable/hooks/useHook1";
import Loading from "../reusable/components/basic1/Loading";
import { useEffect, useState } from "react";

export default function GlobalProvider({ children }) {
  const [user, userSet] = useLocalStorage("user", {
    username: "Guest",
    token: undefined,
    role: "Guest",
  });
  // console.log(user);

  const [value, valueSet] = useState({
    startDate: null,
    endDate: null,
  });

  const [finalDatesArr, setFinalDatesArr] = useState([]);

  useEffect(() => {
    const dates = [];
    for (
      let date = dayjs(value.startDate);
      date.isSameOrBefore(dayjs(value.endDate));
      date = date.add(1, "day")
    ) {
      dates.push(date.format("YYYY-MM-DD dddd"));
    }
    setFinalDatesArr(dates);
  }, [value]);

  if (urlEvents.length === 0) return <Loading></Loading>;

  if (urlEvents) {
    return (
      <GlobalContext.Provider
        value={{ urlEvents, user, userSet, finalDatesArr, value, valueSet }}
      >
        {children}
      </GlobalContext.Provider>
    );
  }
}

GlobalProvider.propTypes = {
  children: PropTypes.any,
};
