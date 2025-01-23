import PropTypes from "prop-types";
import { formatTime } from "../../../lib/utils0";
export default function Ut({ e }) {
  const timelog = e.event.data.map((log) => formatTime(log.dateTime) + "| ");
  return (
    <div
      className={`text-wrap text-xs ${e.title === "UFT" ? "text-purple-300" : "text-green-300"}`}
    >
      {e.title}: {timelog}
    </div>
  );
}

Ut.propTypes = {
  e: PropTypes.object,
};
