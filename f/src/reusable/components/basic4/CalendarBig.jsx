import PropTypes from "prop-types";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendarBig.css";

import CalendarYear from "./CalendarYear";
import { useLocalStorage, useLocalStorageDate } from "../../hooks/useHook1";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const localizer = dayjsLocalizer(dayjs);

let allViews = {
  year: CalendarYear,
  month: true,
  week: true,
  day: true,
  agenda: true,
};

export default function CalendarBig({
  myEvents = [],
  components = {},
  to = "/",
}) {
  const navigate = useNavigate();

  const [date, dateSet] = useLocalStorageDate("CalendarBigDate", dayjs());

  const [view, viewSet] = useLocalStorage("CalendarBigView", Views.DAY);

  const onView = useCallback((newView) => viewSet(newView), [viewSet]);
  const onNavigate = useCallback((date) => dateSet(date), [dateSet]);

  const events = myEvents.filter((item) =>
    dayjs(item.start).isSame(dayjs(date), "month"),
  );

  const handleSelectEvent = useCallback(
    (e) => {
      onView(Views.DAY);
      onNavigate(e.start);
    },
    [onNavigate, onView],
  );

  const handleSelectSlot = useCallback(
    (e) => {
      dateSet(e.start);
      navigate(to, { state: e });
    },
    [navigate, to, dateSet],
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-screen">
        <Calendar
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          components={components}
          date={date}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={onView}
          onNavigate={onNavigate}
          views={allViews}
          messages={{ year: "Year" }}
          showMultiDayTimes={true}
        />
      </div>
    </div>
  );
}

CalendarBig.propTypes = {
  components: PropTypes.object,
  myEvents: PropTypes.array,
  to: PropTypes.string,
};
