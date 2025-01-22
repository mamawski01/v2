import PropTypes from "prop-types";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendarBig.css";

import CalendarYear from "./CalendarYear";
import { useLocalStorage } from "../../hooks/useHook1";
import { useCallback, useMemo } from "react";

const localizer = dayjsLocalizer(dayjs);

let allViews = {
  year: CalendarYear,
  month: true,
  week: true,
  day: true,
  agenda: true,
};

export default function CalendarBig({
  myArrEvents = [],
  onSelectSlot = () => {},
  onSelectEvent = () => {},
  components = {},
  date = {},
  dateSet = () => {},
}) {
  const [view, viewSet] = useLocalStorage("CalendarBigView", Views.DAY);

  const onView = useCallback((newView) => viewSet(newView), [viewSet]);
  const onNavigate = useCallback((date) => dateSet(date), [dateSet]);

  const { events } = useMemo(() => ({ events: myArrEvents }), [myArrEvents]);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="h-screen">
        <Calendar
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
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
  date: PropTypes.object,
  dateSet: PropTypes.func,
  myArrEvents: PropTypes.array,
  onSelectEvent: PropTypes.func,
  onSelectSlot: PropTypes.func,
};
