import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { style } from "./useUserSchedule";

export default function Us({ e }) {
  const schedule =
    e.event.data.timeInSelect === "day-off" ||
    e.event.data.timeOutSelect === "day-off"
      ? `Day-off`
      : `${e.event.data.timeInSelect} to ${e.event.data.timeOutSelect}, Brk: ${e.event.data.brkDurationSelect}`;
  return (
    <div className="flex">
      <Link
        to={`userScheduleForm/${e.event.data._id}`}
        state={e.event}
        className={`${style} text-wrap`}
      >
        {e.title}: {schedule} || edit
      </Link>
    </div>
  );
}

Us.propTypes = {
  e: PropTypes.object,
};
