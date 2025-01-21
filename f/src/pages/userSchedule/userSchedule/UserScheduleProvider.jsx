import PropTypes from "prop-types";

import { UserScheduleContext } from "./useUserSchedule";
import {
  confirmedUserGetOP,
  useFetch,
  useLocalStorage,
  useMutate,
  userSchedulePostUnique,
} from "../../../reusable/hooks/useHook1";
import { useParams } from "react-router-dom";
import Loading from "../../../reusable/components/basic1/Loading";
import { useGlobal } from "../../../context/globalHook";
import { post } from "../../../api/api";

export default function UserScheduleProvider({ children }) {
  const { mutate, isPending } = useMutate();
  const { id, uid } = useParams();
  const edit = Boolean(id);

  const { data: user } = useFetch(confirmedUserGetOP + id);

  const dbData = user?.data;

  const [showUS, showUSSet] = useLocalStorage("showUS", false);
  const [showUF, showUFSet] = useLocalStorage("showUF", false);

  const { finalDatesArr } = useGlobal();

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
        // dataId: user.data.dataId,
        timeIn: info[dayOfWeek].timeIn,
        timeOut: info[dayOfWeek].timeOut,
        brkDuration: info.brkDuration,
      };
    });
    return (
      <UserScheduleContext.Provider
        value={{
          showUS,
          showUSSet,
          showUF,
          showUFSet,
          scheduleListToSave,
          isPending,
          userSchedulePostAllUnique,
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
