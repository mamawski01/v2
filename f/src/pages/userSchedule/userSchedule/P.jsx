import PropTypes from "prop-types";

export default function P({ e }) {
  const data = e.event.data;
  const totalW = data.totalW;
  const dutyHrsW = data.dutyHrsW;
  const OTHrsW = data.OTHrsW;
  const late = data.stats.late;
  const overtime = data.stats.overtime;
  const underTime = data.stats.underTime;
  const overBrk = data.stats.overBrk;
  const OTHrs = data.OTHrs;
  return (
    <div className="flex flex-col text-wrap text-xs text-blue-400">
      <p>Total wage: {totalW}</p>
      <p>Duty hrs wage: {dutyHrsW}</p>
      {Number(OTHrs) > 0 && <p>Duty OT hrs wage: {OTHrsW}</p>}
      <div className="text-red-400">
        Stats:
        <div className="ml-2">
          {late && <p>late: {late}</p>}
          {overtime && <p>overtime: {overtime}</p>}
          {underTime && <p>underTime: {underTime}</p>}
          {overBrk && <p>overBrk: {overBrk}</p>}
        </div>
      </div>
    </div>
  );
}

P.propTypes = {
  e: PropTypes.object,
};
