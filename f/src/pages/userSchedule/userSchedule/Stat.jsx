import PropTypes from "prop-types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import objectSupport from "dayjs/plugin/objectSupport";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(duration);
dayjs.extend(objectSupport);
dayjs.extend(customParseFormat);
import { v4 as uuidv4 } from "uuid";

import {
  formatDateIncomplete,
  formatDateUsable,
  formatTime,
  formatTime_hhmm_a,
  formatTime_hhmm_ss,
  pureTimeAdder,
  timeDiff,
  timeToNum,
  toNumb,
  toPeso,
  twoDecimal,
} from "../../../lib/utils0";
import useUserSchedule, { style } from "./useUserSchedule";
import { patch, post, remove } from "../../../api/api";
import { Link } from "react-router-dom";
import {
  userEventPatchOne,
  userEventPostOne,
  userEventRemoveOne,
  userFinalTimelogPatchOne,
  userPayrollPatchOne,
  userPayrollPostUnique,
  userPayrollRemoveOne,
  userTimelogPostUnique,
} from "../../../reusable/hooks/useHook1";
import BtnEdit from "../../../reusable/components/basic2/BtnEdit";
import BtnDelete from "../../../reusable/components/basic2/BtnDelete";
import { swalAlert } from "../../../lib/utils1";
import BtnSave from "../../../reusable/components/basic2/BtnSave";

export default function Stat({ e }) {
  const { userWage, wageRate, isPending, mutate } = useUserSchedule();

  const data = e.event.data;
  const us = data.us;

  const dayOff =
    us.timeInSelect === "day-off" || us.timeOutSelect === "day-off"
      ? "day-off"
      : false;

  const notDayOff = !dayOff;

  const date = us.uniqueData.split(" ")[0];
  const brkDurationSelect = formatDateUsable(
    `${date} 0:${us.brkDurationSelect.split(" ")[0]}:00`,
  );
  const timeInSelect = dayOff
    ? dayOff
    : formatDateUsable(`${date} ${us.timeInSelect}`, true);

  const timeOutSelect = dayOff
    ? dayOff
    : formatDateUsable(`${date} ${us.timeOutSelect}`, true);

  const uft = data.uft;

  const isTomorrowOrLater = dayjs().isAfter(dayjs(date));
  const absent =
    uft.length === 0 && !dayOff && isTomorrowOrLater ? `absent,` : false;
  const onDuty =
    uft.length > 0 && !dayOff && isTomorrowOrLater ? `onDuty` : false;

  const dataId = onDuty && uft[0].dataId;
  const name = onDuty && uft[0].name;
  const mode = onDuty && uft[0].mode;

  const actTimeInSelect = onDuty && uft[0].dateTime;
  const actTimeOutSelect = onDuty && uft[uft.length - 1].dateTime;
  const lastId = onDuty && uft[uft.length - 1]._id;
  const uftLog = onDuty && uft.map((log) => log);

  const notimeOutSelect = onDuty && uftLog.length % 2 === 1 && `no time out,`;

  const late =
    onDuty &&
    timeDiff(actTimeInSelect, timeInSelect) > 0 &&
    timeDiff(actTimeInSelect, timeInSelect);

  const overtime =
    onDuty && timeDiff(actTimeOutSelect, timeOutSelect) > 0
      ? timeDiff(actTimeOutSelect, timeOutSelect).format("HH:mm:ss")
      : false;

  const ot30mins =
    overtime &&
    timeDiff(`${date} ${overtime}`, `${date} 00:30:00`) >= 0 &&
    `Overtime: ${overtime}`;

  const underTime =
    onDuty && !notimeOutSelect && timeDiff(actTimeOutSelect, timeOutSelect) < 0
      ? `Under-time: ${timeDiff(timeOutSelect, actTimeOutSelect).format("HH:mm:ss")},`
      : false;

  const logs =
    uft.length % 2 === 0 &&
    uft.reduce((acc, current, index) => {
      if (index % 2 === 0) {
        acc.push(
          timeDiff(uft[index + 1].dateTime, current.dateTime).format(
            "YYYY-MM-DD HH:mm:ss",
          ),
        );
      }
      return acc;
    }, []);

  const dutyHrs =
    onDuty && logs && pureTimeAdder(...logs) > 0 && pureTimeAdder(...logs);

  const stayInOfficeHrs =
    dutyHrs &&
    `Office stay: ${timeDiff(actTimeOutSelect, actTimeInSelect).format("HH:mm:ss")},`;

  const dutyAndOfficeDiff =
    dutyHrs &&
    timeDiff(
      `${date} ${stayInOfficeHrs.split(" ")[2].replace(/,/g, "")}`,
      `${date} ${dutyHrs.format("HH:mm:ss")}`,
    );

  const overBrk =
    dutyHrs &&
    dutyAndOfficeDiff > 0 &&
    timeDiff(
      `${date} ${dutyAndOfficeDiff.format("HH:mm:ss")}`,
      brkDurationSelect,
    );

  const overBrkStatus =
    dutyHrs && overBrk > 0 && `Over break: ${overBrk.format("HH:mm:ss")},`;

  const timeInSelectAndOutDiff =
    onDuty && timeDiff(timeOutSelect, timeInSelect).format("HH:mm:ss");
  const expectedDutyHrs =
    dutyHrs &&
    onDuty &&
    timeDiff(`${date} ${timeInSelectAndOutDiff}`, brkDurationSelect);

  const overBrkAndLate =
    late &&
    pureTimeAdder(
      ...(late ? [late.format("YYYY-MM-DD HH:mm:ss")] : []),
      ...(overBrk ? [overBrk.format("YYYY-MM-DD HH:mm:ss")] : []),
    );

  const finalDutyHrs =
    expectedDutyHrs < dutyHrs
      ? dutyHrs && late
        ? timeDiff(
            `${date} ${expectedDutyHrs.format("HH:mm:ss")}`,
            `${date} ${overBrkAndLate.format("HH:mm:ss")}`,
          ).format("HH:mm:ss")
        : expectedDutyHrs.format("HH:mm:ss")
      : dutyHrs && dutyHrs.format("HH:mm:ss");

  const wCreated = userWage?.data?.length > 0;
  //wage
  const w = wCreated && e.event.data.w;
  const dailyW = w && w.wage;
  const sssAllowance = w && w.sssAllowance;
  const dateHired = w && w.dateHired;
  //wage

  //events

  const event = e.event.data.e;
  const eventTypes = ["dayOff", "regular", "special"];

  const ordinaryDay =
    event.every((obj) => !eventTypes.includes(obj.eventType)) && "ordinary";

  const specialDay =
    event.some((obj) => obj.eventType.includes("special")) && "special";

  const regularDay =
    event.some((obj) => obj.eventType.includes("regular")) && "regular";

  const dayOffDay =
    event.some((obj) => obj.eventType.includes("dayOff")) && "dayOff";

  const isOrdinaryDay =
    ordinaryDay && !specialDay && !regularDay && !dayOffDay && "ordinary";

  const isSpecialDay =
    !ordinaryDay && specialDay && !regularDay && !dayOffDay && "special";

  const isRegularDay = !ordinaryDay && regularDay && !dayOffDay && "regular";

  const isDayOffSpecial =
    !ordinaryDay && specialDay && !regularDay && dayOffDay && "dayOffSpecial";

  const isDayOffRegular =
    !ordinaryDay && regularDay && dayOffDay && "dayOffRegular";

  const isDayOff =
    !ordinaryDay && !specialDay && !regularDay && dayOffDay && "dayOff";

  const day =
    isOrdinaryDay ||
    isSpecialDay ||
    isRegularDay ||
    isDayOffSpecial ||
    isDayOffRegular ||
    isDayOff;

  //events

  //wage rule
  const isReg =
    w && w.employmentType === "regular" ? "regular" : "probationary";
  const wageRateData = wageRate.data;
  const regRules = isReg
    ? wageRateData.employmentType.regular
    : wageRateData.employmentType.probationary;

  const wageRule = regRules.rules[day];
  const dayOffW = wageRule.dayOff;
  const dutyW = wageRule.duty;
  const otW = wageRule.overTime;
  const dayW = wageRule.day;

  //final wage

  const dutyHrsInNum = timeToNum(finalDutyHrs);
  const otHrsInNum = timeToNum(ot30mins);
  const dailyWPerHr = w && w.wage / 8;

  const dailyWPerHrInEvent = dailyWPerHr * toNumb(dutyW);
  const dailyWPerHrInOt = dailyWPerHr * toNumb(otW);
  const dailyWPerHrInOtEvent = dailyWPerHrInOt * toNumb(dutyW);

  const dutyHrsWF = dailyWPerHrInEvent * dutyHrsInNum;
  const dutyHrsWOTf = dailyWPerHrInOtEvent * otHrsInNum;

  const dayOffWF = toNumb(dayOffW) * toNumb(dailyW);

  const totalW = dayOffWF + dutyHrsWF + dutyHrsWOTf;

  //payroll
  const p = e.event.data.p;
  //incentives
  const allowW = w && w.allowance;

  const dailyAllowanceId =
    event.length > 0 &&
    event.find((obj) => obj.eventName.includes("Daily Allowance"))?._id;

  return (
    <div className="text-wrap text-xs">
      <p>
        {e.title}: {dayOff} {onDuty} {absent}
        {onDuty &&
          `| ${formatTime_hhmm_a(timeInSelect)} to ${formatTime_hhmm_a(timeOutSelect)}, Brk: ${formatTime_hhmm_ss(brkDurationSelect)}`}
      </p>
      {stayInOfficeHrs} {finalDutyHrs && `Duty hrs: ${finalDutyHrs},`}{" "}
      {ot30mins}
      <div className="flex flex-col text-red-300">
        {absent} {notimeOutSelect} {late && `Late: ${late.format("HH:mm:ss")},`}{" "}
        {underTime}
        {overBrkStatus}
        {ot30mins && (
          <button
            className={`${style}`}
            disabled={isPending}
            onClick={() =>
              mutate(
                patch(userFinalTimelogPatchOne + lastId, {
                  dateTime: timeOutSelect,
                }),
              )
            }
          >
            {overtime}, cancel OT?
          </button>
        )}
      </div>
      <ul className="mt-1 flex flex-col gap-1">
        {onDuty &&
          uftLog.slice().map((log, i) => (
            <Link
              to={"userFinalTimelogForm"}
              state={log}
              className={`${style}`}
              disabled={isPending}
              key={i}
            >
              {formatTime(log.dateTime)} || edit
            </Link>
          ))}
      </ul>
      {notDayOff && (
        <button
          onClick={() =>
            mutate(
              post(userTimelogPostUnique, {
                uniqueData: uuidv4(),
                dataId,
                name,
                mode,
                dateTime: timeOutSelect,
                title: e.title,
              }),
            )
          }
          disabled={isPending}
          className={`${style} mt-1`}
        >
          Create new timelog
        </button>
      )}
      <div className="mt-2 border-t border-gray-500 pt-2">
        {wCreated ? (
          <Link
            to={`wageForm/${e.event.data?.w?._id}`}
            state={e.event.data}
            className={`${style}`}
            disabled={isPending}
          >
            Edit wage rule
          </Link>
        ) : (
          <Link
            to={"wageForm"}
            className={`${style}`}
            disabled={isPending}
            state={e.event.data}
          >
            Create wage rule
          </Link>
        )}
      </div>
      {wCreated && (
        <div className="mt-2">
          <div className="flex flex-wrap justify-evenly">
            <div>
              <p className="text-blue-300">Wage rules:</p>
              <div>Date Hired: {formatDateIncomplete(dateHired, true)}</div>
              <div>Employment type: {isReg}</div>
              <div>Day: {day}</div>
              <div>Daily wage: {toPeso(dailyW)}</div>
              <div>Daily wage per hour: {toPeso(dailyWPerHr)}</div>
              <div>Daily Allowance: {toPeso(allowW)}</div>
              <div>SSS Allowance: {toPeso(sssAllowance)}</div>
            </div>
            <div>
              <p className="text-blue-300">Wage multiplier:</p>
              <div>Day-off wage: {dayOffW}</div>
              <div>Duty wage: {dutyW}</div>
              <div>Overtime: {otW}</div>
              <div>day: {dayW}</div>
            </div>
          </div>
          <div>
            <p className="mt-2 text-center text-blue-300">Wage calculation:</p>
            <div className="grid grid-cols-2 gap-5 gap-x-10">
              <div>
                <div>
                  <div>Default wage per hr: {toPeso(dailyWPerHr)}</div>
                  <div>
                    Wage per hr in {dayW}:{toPeso(dailyWPerHrInEvent)}
                  </div>
                  <p>
                    ({toPeso(dailyWPerHr)} X {dutyW} =
                    {toPeso(dailyWPerHrInEvent)})
                  </p>
                  <p>X</p>
                  <div>Duty hours: {toPeso(dutyHrsInNum)} hrs</div>
                  <div className="border-t text-green-400">
                    Duty hrs wage: {toPeso(dutyHrsWF)}
                  </div>
                </div>
              </div>
              <div>
                <div>Daily wage: {toPeso(dailyW)}</div>
                <p>X</p>
                <div>Day-off wage: {dayOffW}</div>
                <div className="border-t text-green-400">
                  Day-off wage: {toPeso(dayOffWF)}
                </div>
              </div>
              <div>
                <div>
                  Default wage per OT hr:
                  {toPeso(dailyWPerHrInOt)}
                </div>
                <p>
                  ({toPeso(dailyWPerHr)} X {otW} ={toPeso(dailyWPerHrInOt)})
                </p>
                <div>
                  Wage per OT hr in {dayW}:{toPeso(dailyWPerHrInOtEvent)}
                </div>
                <p>
                  ({toPeso(dailyWPerHrInOt)} X {dutyW} = ₱
                  {toPeso(dailyWPerHrInOtEvent)})
                </p>
                <p>X</p>
                <div>OT hrs: {twoDecimal(otHrsInNum)}</div>
                <div className="border-t text-green-400">
                  Duty OT hrs wage: {toPeso(dutyHrsWOTf)}
                </div>
              </div>
              <div className="flex flex-col">
                <p>Day-off wage: {toPeso(dayOffWF)}</p>
                <p>Duty OT hrs wage: {toPeso(dutyHrsWOTf)}</p>
                <p>Duty hrs wage: {toPeso(dutyHrsWF)}</p>
                <p className="border-t text-emerald-400">
                  Total Wage: {toPeso(totalW)}
                </p>
              </div>
            </div>
            <div className="mt-2">Daily Allowance: {toPeso(allowW)}</div>
            {notDayOff && !absent && (
              <div className="flex justify-center">
                {p && notDayOff ? (
                  <div className="mt-2 flex w-full justify-evenly">
                    <BtnEdit
                      onClick={async () => {
                        mutate(
                          patch(userPayrollPatchOne + p._id, {
                            defWagePerHr: toPeso(dailyWPerHr),
                            wagePerHrWEvent: toPeso(dailyWPerHrInEvent),
                            dutyHrs: twoDecimal(dutyHrsInNum),
                            dutyHrsW: toPeso(dutyHrsWF),
                            defOTWagePerHr: toPeso(dailyWPerHrInOt),
                            OTwagePerHrWEvent: toPeso(dailyWPerHrInOtEvent),
                            OTHrs: twoDecimal(otHrsInNum),
                            OTHrsW: toPeso(dutyHrsWOTf),
                            dailyW: toPeso(dailyW),
                            dailyWMulti: wageRule.day,
                            dayOffW: toPeso(dayOffWF),
                            sssAllowance: toPeso(sssAllowance),
                            totalW: toPeso(totalW),

                            stats: {
                              late: late ? late.format("HH:mm:ss") : "",
                              overtime: overtime ? overtime : "",
                              underTime: underTime
                                ? formatTime_hhmm_ss(
                                    timeDiff(timeOutSelect, actTimeOutSelect),
                                  ).format("HH:mm:ss")
                                : "",
                              overBrk: overBrkStatus
                                ? overBrk.format("HH:mm:ss")
                                : "",
                            },

                            event: dayW,
                          }),
                        ),
                          Number(allowW) !== 0 &&
                            mutate(
                              patch(userEventPatchOne + dailyAllowanceId, {
                                reward: toPeso(allowW),
                              }),
                            );
                      }}
                    >
                      Update Payroll and Allowance
                    </BtnEdit>
                    <BtnDelete
                      onClick={async () => {
                        const confirmDelete = await swalAlert(
                          "Yes, delete Payroll and Allowance",
                        );
                        if (confirmDelete.isConfirmed) {
                          await Promise.all([
                            mutate(remove(userPayrollRemoveOne + p._id)),
                            Number(allowW) !== 0
                              ? mutate(
                                  remove(userEventRemoveOne + dailyAllowanceId),
                                )
                              : Promise.resolve(),
                          ]);
                        }
                      }}
                    >
                      Delete Payroll and Allowance
                    </BtnDelete>
                  </div>
                ) : (
                  <BtnSave
                    isPending={isPending}
                    onClick={async () => {
                      mutate(
                        post(userPayrollPostUnique, {
                          uniqueData: us.uniqueData,

                          defWagePerHr: toPeso(dailyWPerHr),
                          wagePerHrWEvent: toPeso(dailyWPerHrInEvent),
                          dutyHrs: twoDecimal(dutyHrsInNum),
                          dutyHrsW: toPeso(dutyHrsWF),

                          defOTWagePerHr: toPeso(dailyWPerHrInOt),
                          OTwagePerHrWEvent: toPeso(dailyWPerHrInOtEvent),
                          OTHrs: twoDecimal(otHrsInNum),
                          OTHrsW: toPeso(dutyHrsWOTf),

                          dailyW: toPeso(dailyW),
                          dailyWMulti: wageRule.day,
                          dayOffW: toPeso(dayOffWF),

                          sssAllowance: toPeso(sssAllowance),
                          totalW: toPeso(totalW),

                          stats: {
                            late: late ? late.format("HH:mm:ss") : "",
                            overtime: ot30mins ? overtime : "",
                            underTime: underTime
                              ? timeDiff(
                                  timeOutSelect,
                                  actTimeOutSelect,
                                ).format("HH:mm:ss")
                              : "",
                            overBrk: overBrkStatus
                              ? overBrk.format("HH:mm:ss")
                              : "",
                          },

                          event: dayW,
                          dataId: us.dataId,
                          firstName: us.firstName,
                        }),
                      );
                      Number(allowW) !== 0 &&
                        mutate(
                          post(userEventPostOne, {
                            date,
                            eventName: "Daily Allowance",
                            firstName: us.firstName,
                            eventDescription: "",
                            eventType: "reward",
                            dataId,
                            penalty: "",
                            benefitCost: "",
                            reward: toPeso(allowW),
                          }),
                        );
                    }}
                  >
                    Create Payroll and Allowance
                  </BtnSave>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Stat.propTypes = {
  e: PropTypes.object,
};
