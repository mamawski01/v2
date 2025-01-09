import PropTypes from "prop-types";

import "./calendarYear.css";
import { Navigate, Views } from "react-big-calendar";
import Calendar from "react-calendar";

export default function CalendarYear({
  date,
  localizer,
  onView,
  onNavigate,
  // events,
}) {
  const currRange = CalendarYear.range(date, { localizer });
  return (
    <div className="grid justify-items-center gap-2 lg:grid-cols-2 xl:grid-cols-3">
      {currRange.slice().map((month, i) => (
        <div key={i}>
          <Calendar
            activeStartDate={month}
            onClickDay={(day) => {
              console.log(day);
              onView && onView(Views.DAY), onNavigate(day);
            }}
            calendarType={"gregory"}
          ></Calendar>
        </div>
      ))}
    </div>
  );
}

CalendarYear.propTypes = {
  date: PropTypes.object,
  events: PropTypes.array,
  localizer: PropTypes.object,
  onNavigate: PropTypes.func,
  onView: PropTypes.func,
};

CalendarYear.range = (date, { localizer }) => {
  const start = localizer.startOf(date, "year");
  const end = localizer.endOf(date, "year");

  const range = [];
  let current = start;

  while (localizer.lte(current, end, "year")) {
    range.push(current);
    current = localizer.add(current, 1, "month");
  }

  return range;
};
CalendarYear.navigate = (date, action, { localizer }) => {
  if (action instanceof Date) return action;
  switch (action) {
    case Navigate.NEXT:
      return localizer.add(date, 1, "year");
    case Navigate.PREVIOUS:
      return localizer.add(date, -1, "year");
    default:
      return date;
  }
};
CalendarYear.title = (date, { localizer }) => {
  return localizer.format(date, "YYYY");
};
