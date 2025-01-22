import PropTypes from "prop-types";
import dayjs from "dayjs";

import { UserScheduleContext } from "./useUserSchedule";
import {
  confirmedUserGetOP,
  useFetch,
  useLocalStorage,
  useLocalStorageDate,
  useMutate,
  userScheduleGetGroup,
  userSchedulePostUnique,
} from "../../../reusable/hooks/useHook1";
import { useParams } from "react-router-dom";
import Loading from "../../../reusable/components/basic1/Loading";
import { useGlobal } from "../../../context/globalHook";
import { post } from "../../../api/api";
import { useMemo } from "react";
import Stat from "./Stat";

export default function UserScheduleProvider({ children }) {
  const { mutate, isPending } = useMutate();
  const { id, dId } = useParams();
  const edit = Boolean(id);

  const { data: user } = useFetch(confirmedUserGetOP + id);
  const { data: userSchedule } = useFetch(userScheduleGetGroup + dId);

  const dbData = user?.data;

  const [showUS, showUSSet] = useLocalStorage("showUS", false);
  const [showUF, showUFSet] = useLocalStorage("showUF", false);

  const [date, dateSet] = useLocalStorageDate("date", dayjs());

  const [showS, showSSet] = useLocalStorage("showS", false);
  const [showUSch, showUSchSet] = useLocalStorage("showUSch", false);
  const [showUT, showUTSet] = useLocalStorage("showUT", false);
  const [showUFT, showUFTSet] = useLocalStorage("showUFT", false);

  const { finalDatesArr } = useGlobal();

  const components = useMemo(
    () => ({
      event: (e) => {
        switch (e.title) {
          case "Stat": {
            return <Stat e={e}></Stat>;
          }
          default: {
            return <div className="text-xs">{e.title}</div>;
          }
        }
      },
    }),
    [],
  );

  if (!dbData) return <Loading></Loading>;
  if (dbData) {
    function userSchedulePostAllUnique() {
      return mutate(post(userSchedulePostUnique, scheduleListToSave));
    }

    const scheduleListToSave = finalDatesArr.map((date) => {
      const dateOnly = date.split(" ")[0].toLowerCase();
      const dayOfWeek = date.split(" ")[1].toLowerCase();
      const info = user.data.weeklySchedule;

      return {
        uniqueData: `${dateOnly} ${user.data.dataId}`,
        firstName: user.data.firstName,
        middleName: user.data.middleName,
        lastName: user.data.lastName,
        dataId: user.data.dataId,
        timeIn: info[dayOfWeek].timeIn,
        timeOut: info[dayOfWeek].timeOut,
        brkDuration: info.brkDuration,
      };
    });

    function scheduleListEvent(...scheduleList) {
      const us = scheduleList[0].data;
      //  const ut = scheduleList[1].data;
      //  const uft = scheduleList[2].data;
      //  const e = scheduleList[3];
      //  const w = scheduleList[4].data[0];
      //  const p = scheduleList[5].data;

      const expectedArray = us.map((usItem) => {
        const startDate = usItem.uniqueData.split(" ")[0];
        //  const utItems = ut.filter((utItem) =>
        //    utItem.dateTime.startsWith(startDate),
        //  );
        //  const uftItems = uft.filter((uftItem) =>
        //    uftItem.dateTime.startsWith(startDate),
        //  );
        //  const eItems = e.filter((eItem) => eItem.date.startsWith(startDate));
        //  const pItems = p.filter((eItem) =>
        //    eItem.uniqueData.startsWith(startDate),
        //  );

        return {
          title: "Stat",
          start: dayjs(`${startDate} 00:00:00`).$d,
          end: dayjs(`${startDate} 18:00:00`).$d,
          data: {
            us: usItem,
            //  ut: utItems,
            //  uft: uftItems,
            //  e: eItems,
            //  w,
            //  p: pItems,
          },
        };
      });

      return expectedArray;
    }

    const s = scheduleListEvent(userSchedule);
    const myArr = [...(showS ? s : [])];

    const myEvents = myArr.filter((item) =>
      dayjs(item.start).isSame(dayjs(date), "month"),
    );

    return (
      <UserScheduleContext.Provider
        value={{
          user,
          showUS,
          showUSSet,
          showUF,
          showUFSet,
          scheduleListToSave,
          isPending,
          userSchedulePostAllUnique,
          showUSch,
          showUSchSet,
          showUT,
          showUTSet,
          showUFT,
          showUFTSet,
          showS,
          showSSet,
          myEvents,
          date,
          dateSet,
          components,
        }}
      >
        {children}
      </UserScheduleContext.Provider>
    );
  }
}

UserScheduleProvider.propTypes = {
  children: PropTypes.node,
};
