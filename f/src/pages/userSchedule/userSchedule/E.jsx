import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { style } from "./useUserSchedule";

export default function E({ e }) {
  return (
    <div className="text-xs text-teal-300">
      <Link
        to={`eventForm/${e.event.data._id}`}
        state={e.event}
        className={`${style} text-wrap`}
      >
        {e.title}: {e.event.data.eventName} || edit - {e.event.data.eventType},{" "}
        {e.event.data?.description && `Description${e.event.data?.description}`}
      </Link>
    </div>
  );
}

E.propTypes = {
  e: PropTypes.object,
};
