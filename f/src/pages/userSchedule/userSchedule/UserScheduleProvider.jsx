import PropTypes from "prop-types";
import dayjs from "dayjs";

import { UserScheduleContext } from "./useUserSchedule";
import {
  confirmedUserGetOP,
  useFetch,
  useLocalStorage,
  useMutate,
  userEventGetGroup,
  userEventGetGroupAll,
  userFinalTimelogGetGroup,
  userScheduleGetGroup,
  userSchedulePostUnique,
  userTimelogGetGroup,
} from "../../../reusable/hooks/useHook1";
import { useParams } from "react-router-dom";
import Loading from "../../../reusable/components/basic1/Loading";
import { useGlobal } from "../../../context/globalHook";
import { post } from "../../../api/api";
import { useMemo } from "react";
import Stat from "./Stat";
import Us from "./Us";
import Ut from "./Ut";
import E from "./E";

export default function UserScheduleProvider({ children }) {
  const { mutate, isPending } = useMutate();
  const { id, dId } = useParams();
  // const edit = Boolean(id);

  const { data: user } = useFetch(confirmedUserGetOP + id);
  const { data: userSchedule } = useFetch(userScheduleGetGroup + dId);
  const { data: userTimelog } = useFetch(userTimelogGetGroup + dId);
  const { data: userFinalTimelog } = useFetch(userFinalTimelogGetGroup + dId);
  const { data: userEvent } = useFetch(userEventGetGroup + dId);
  const { data: allUserEvent } = useFetch(userEventGetGroupAll + "0");

  const dbData =
    user?.data &&
    userSchedule?.data &&
    userTimelog?.data &&
    userFinalTimelog?.data &&
    userEvent?.data &&
    allUserEvent?.data;

  const [showUS, showUSSet] = useLocalStorage("showUS", false);
  const [showUF, showUFSet] = useLocalStorage("showUF", false);

  const [showS, showSSet] = useLocalStorage("showS", false);
  const [showUSch, showUSchSet] = useLocalStorage("showUSch", false);
  const [showUT, showUTSet] = useLocalStorage("showUT", false);
  const [showUFT, showUFTSet] = useLocalStorage("showUFT", false);
  const [showE, showESet] = useLocalStorage("showE", false);

  const { finalDatesArr } = useGlobal();

  const components = useMemo(
    () => ({
      event: (e) => {
        switch (e.title) {
          case "Stat": {
            console.log(e);
            return <Stat e={e}></Stat>;
          }
          case "US": {
            return <Us e={e}></Us>;
          }
          case "UT": {
            return <Ut e={e}></Ut>;
          }
          case "UFT": {
            return <Ut e={e}></Ut>;
          }
          case "E": {
            return <E e={e}></E>;
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
        timeInSelect: info[dayOfWeek].timeInSelect,
        timeOutSelect: info[dayOfWeek].timeOutSelect,
        brkDurationSelect: info.brkDurationSelect,
      };
    });

    const ut = utFx(userTimelog.data);
    const uft = utFx(userFinalTimelog.data);
    const uSch = uSchFx(userSchedule.data);
    const s = scheduleListEvent(userSchedule, userTimelog, userFinalTimelog, [
      ...userEvent.data,
      ...allUserEvent.data,
    ]);
    const e = events([...userEvent.data, ...allUserEvent.data]);

    const myEvents = [
      ...(showS ? s : []),
      ...(showUSch ? uSch : []),
      ...(showUT ? ut : []),
      ...(showUFT ? uft : []),
      ...(showE ? e : []),
    ];

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
          components,
          showE,
          showESet,
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

function scheduleListEvent(...scheduleList) {
  const us = scheduleList[0].data;
  const ut = scheduleList[1].data;
  const uft = scheduleList[2].data;
  const e = scheduleList[3];
  //  const w = scheduleList[4].data[0];
  //  const p = scheduleList[5].data;

  const expectedArray = us.map((usItem) => {
    const startDate = usItem.uniqueData.split(" ")[0];
    const utItems = ut.filter((utItem) =>
      utItem.dateTime.startsWith(startDate),
    );
    const uftItems = uft.filter((uftItem) =>
      uftItem.dateTime.startsWith(startDate),
    );
    const eItems = e.filter((eItem) => eItem.date.startsWith(startDate));
    //  const pItems = p.filter((eItem) =>
    //    eItem.uniqueData.startsWith(startDate),
    //  );

    return {
      title: "Stat",
      start: dayjs(`${startDate} 00:00:00`).$d,
      end: dayjs(`${startDate} 18:00:00`).$d,
      data: {
        us: usItem,
        ut: utItems,
        uft: uftItems,
        e: eItems,
        //  w,
        //  p: pItems,
      },
    };
  });

  return expectedArray;
}

function utFx(timelog) {
  const result = {};
  timelog.forEach((log) => {
    const date = log.dateTime.split(" ")[0];
    const title = log.title;
    const start = dayjs(`${date} 09:00:00`).$d;
    const end = dayjs(`${date} 18:00:00`).$d;

    if (!result[date]) {
      result[date] = { date, title, start, end, data: [log] };
    } else {
      result[date].data.push(log);
    }
  });
  return Object.values(result);
}

function events(eventsArr) {
  const expectedArr = eventsArr.map((event) => {
    return {
      title: event.title,
      start: dayjs(`${event.date} 02:00:00`).$d,
      end: dayjs(`${event.date} 07:00:00`).$d,
      data: event,
    };
  });
  return expectedArr;
}

function uSchFx(timelog) {
  const expectedArray = timelog.map((log) => {
    const startDate = log.uniqueData.split(" ")[0];
    return {
      title: log.title,
      start: dayjs(`${startDate} 0:00 am`).$d,
      end: dayjs(`${startDate} 0:00 am`).$d,
      data: log,
    };
  });

  return expectedArray;
}
