import PropTypes from "prop-types";
import { Calendar, dayjsLocalizer, Views } from "react-big-calendar";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import objectSupport from "dayjs/plugin/objectSupport";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(duration);
dayjs.extend(objectSupport);
dayjs.extend(customParseFormat);
import timezone from "dayjs/plugin/timezone";
import { v4 as uuidv4 } from "uuid";
import numeral from "numeral";

import "./calendars.css";

dayjs.extend(timezone);

import CalendarYear from "./CalendarYear";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage, useMutate } from "../../hooks/useHook1";
import Api from "../../../api/api";
import Option from "./Option";
import Icon from "../componentsLvl1/Icon";
import Checkbox from "../componentsLv0/Checkbox";
import { EyeIcon } from "@heroicons/react/24/solid";
import H1mdAndUp from "../componentsLv0/H1mdAndUp";
import useUserSchedule from "../../../pages/user/UseUserSchedule";
import SaveBtn from "./SaveBtn";
import EditBtn from "./EditBtn";
import DeleteBtn from "./DeleteBtn";
import { swalAlert } from "../../../lib/utils1";

const localizer = dayjsLocalizer(dayjs);

let allViews = {
  year: CalendarYear,
  month: true,
  week: true,
  day: true,
  agenda: true,
};

function isValidDate(date) {
  const isValid = dayjs(date, "YYYY-MM-DD HH:mm:ss", true).isValid();
  if (isValid) return isValid;
  else throw new Error(`Invalid Date: ${date}`);
}

function isValidDate2(date) {
  const isValid = dayjs(date, "YYYY-MM-DD HH:mm:ss").isValid();
  if (isValid) return isValid;
  else throw new Error(`Invalid Date: ${date}`);
}

function timeDiff(time1, time2) {
  if (isValidDate(time1) || isValidDate(time2)) {
    const timeDiff = dayjs.duration(dayjs(time1).diff(time2));
    return timeDiff;
  } else throw new Error("Invalid Date");
}

function pureTimeAdder(iniTime, ...accTimes) {
  if (isValidDate2(iniTime)) {
    const [date, timeStr] = iniTime.split(" ");
    const [years, months, days] = date.split("-");
    const [hour, minute, second] = timeStr.split(":");

    const durations = [
      dayjs.duration({
        seconds: second,
        minutes: minute,
        hours: hour,
        days: days,
        months: months,
        years: years,
      }),
    ];
    accTimes.forEach((accTime) => {
      const [dateAcc, timeStrAcc] = accTime.split(" ");
      const [yearsAcc, monthsAcc, daysAcc] = dateAcc.split("-");
      const [hourAcc, minuteAcc, secondAcc] = timeStrAcc.split(":");
      durations.push(
        dayjs.duration({
          seconds: secondAcc,
          minutes: minuteAcc,
          hours: hourAcc,
          days: daysAcc,
          months: monthsAcc,
          years: yearsAcc,
        }),
      );
    });

    return durations.reduce((a, b) => a.add(b));
  }
}

const style = `w-fit rounded bg-zinc-800 hover:bg-zinc-600 p-1 text-xs`;

function benefits(monthlySSS, wageRate, wage) {
  //sss
  const sss = wageRate.data.sss;
  const wageRange =
    monthlySSS < 4250 ? 4000 : monthlySSS > 29750 ? 30000 : monthlySSS;
  const roundedSalary = Math.floor((wageRange + 250) / 500) * 500;
  const rules =
    (roundedSalary < 15000 && sss.monthlySalary14999) ||
    (roundedSalary >= 15000 &&
      roundedSalary <= 29999 &&
      sss.monthlySalary15000) ||
    (roundedSalary >= 30000 && sss.monthlySalary30000);
  const er = numeral(rules.rules.ER).value() * roundedSalary;
  const ee = numeral(rules.rules.EE).value() * roundedSalary;
  const ec = er + numeral(rules.rules.EC).value();
  const eePlusEc = ee + ec;
  //pagIbig
  const pagIbig = wageRate.data.pagIbig;
  const pagIbigEE = numeral(pagIbig.rules.EE).value();
  const pagIbigER = numeral(pagIbig.rules.ER).value();
  const pagIbigTotal = pagIbigEE + pagIbigER;
  //philHealth
  const philHealth = wageRate.data.philHealth;
  const philHealthEE = numeral(philHealth.rules.EE).value();
  const philHealthER = numeral(philHealth.rules.ER).value();
  const philHealthTotal = philHealthEE + philHealthER;

  const fifteenthSal = wage / 2;
  const fifteenthSalNet = fifteenthSal - ee - pagIbigEE - philHealthEE;

  return {
    ec,
    ee,
    eePlusEc,
    pagIbigEE,
    pagIbigER,
    pagIbigTotal,
    philHealthEE,
    philHealthER,
    philHealthTotal,
    fifteenthSal,
    fifteenthSalNet,
  };
}

function status(payroll) {
  const totalDutyHrs = payroll
    .map((obj) => numeral(obj.data.dutyHrs).value())
    .reduce((a, b) => a + b, 0);

  const totalLate = payroll.reduce((acc, obj) => {
    const late = obj.data.stats.late;
    return late !== "" ? acc + 1 : acc;
  }, 0);

  const totalOverBrk = payroll.reduce((acc, obj) => {
    const overBrk = obj.data.stats.overBrk;
    return overBrk !== "" ? acc + 1 : acc;
  }, 0);

  const totalUnderTime = payroll.reduce((acc, obj) => {
    const underTime = obj.data.stats.underTime;
    return underTime !== "" ? acc + 1 : acc;
  }, 0);

  return { totalDutyHrs, totalLate, totalOverBrk, totalUnderTime };
}

export default function Calendars({
  formName = "Form Name",
  myEvents,
  defSchedule,
  date,
  dateSet,
}) {
  const { mutate, isPending } = useMutate();
  const navigate = useNavigate();
  const [view, viewSet] = useLocalStorage("view", Views.DAY);

  const onView = useCallback((newView) => viewSet(newView), [viewSet]);

  const onNavigate = useCallback((date) => dateSet(date), [dateSet]);
  const { events } = useMemo(() => ({ events: myEvents }), [myEvents]);

  const [scheduleList, setScheduleList] = useState([]);

  const {
    showSSet,
    showUTSet,
    showS,
    showUT,
    showUSch,
    showUSchSet,
    showUFT,
    showUFTSet,
    showE,
    showESet,
    wage,
    wageRate,
    showP,
    showPSet,
    showSum,
    showSumSet,
  } = useUserSchedule();

  const payroll = scheduleList.filter((obj) => obj.title.includes("P"));

  const monthlyWage = payroll
    .map((obj) => numeral(obj.data.totalW).value())
    .reduce((a, b) => a + b, 0);

  const monthlySSS = payroll
    .map((obj) => numeral(obj.data.sssAllowance).value())
    .reduce((a, b) => a + b, 0);

  const {
    ec,
    ee,
    eePlusEc,
    pagIbigEE,
    pagIbigER,
    pagIbigTotal,
    philHealthEE,
    philHealthER,
    philHealthTotal,
    fifteenthSal,
    fifteenthSalNet,
  } = benefits(monthlySSS, wageRate, monthlyWage);

  const { totalDutyHrs, totalLate, totalOverBrk, totalUnderTime } =
    status(payroll);

  //event
  const event = scheduleList.filter((obj) => obj.title.includes("E"));

  const penalties = event
    .map((obj) => numeral(obj.data.penalty).value())
    .reduce((a, b) => a + b, 0);
  const penaltyMap = event.filter((obj) =>
    obj.data.eventType.includes("penalty"),
  );

  const benefitCosts = event
    .map((obj) => numeral(obj.data.benefitCost).value())
    .reduce((a, b) => a + b, 0);
  const benefitCostsMap = event.filter((obj) =>
    obj.data.eventType.includes("benefits"),
  );

  const rewards = event
    .map((obj) => numeral(obj.data.reward).value())
    .reduce((a, b) => a + b, 0);
  const rewardsMap = event.filter((obj) =>
    obj.data.eventType.includes("reward"),
  );

  const incentiveStats = rewards - penalties;

  useEffect(() => {
    setScheduleList(events);
    //cleaning
    return () => {};
  }, [events]);

  const handleSelectSlot = useCallback(
    (e) => {
      dateSet(e.start);
      navigate("eventOptions", {
        state: { data: defSchedule, ...e },
      });
    },
    [navigate, defSchedule, dateSet],
  );

  const handleSelectEvent = useCallback(
    (e) => {
      onView(Views.DAY);
      onNavigate(e.start);
    },
    [onNavigate, onView],
  );

  const components = useMemo(
    () => ({
      event: (e) => {
        switch (e.title) {
          case "Stat": {
            const data = e.event.data;
            const us = data.us;

            const dayOff =
              us.timeIn === "day-off" || us.timeOut === "day-off"
                ? "day-off"
                : false;

            const notDayOff = !dayOff;

            const date = us.uniqueData.split(" ")[0];
            const brkDuration = dayjs(
              `${date} 0:${us.brkDuration.split(" ")[0]}:00`,
            ).format("YYYY-MM-DD HH:mm:ss");

            const timeIn = dayOff
              ? dayOff
              : dayjs(`${date} ${us.timeIn}`).format("YYYY-MM-DD HH:mm:ss");

            const timeOut = dayOff
              ? dayOff
              : dayjs(`${date} ${us.timeOut}`).format("YYYY-MM-DD HH:mm:ss");

            const uft = data.uft;

            const isTomorrowOrLater = dayjs().isAfter(dayjs(date));
            const absent =
              uft.length === 0 && !dayOff && isTomorrowOrLater
                ? `absent,`
                : false;
            const onDuty =
              uft.length > 0 && !dayOff && isTomorrowOrLater ? `onDuty` : false;

            const userId = onDuty && uft[0].userId;
            const name = onDuty && uft[0].name;
            const mode = onDuty && uft[0].mode;

            const actTimeIn = onDuty && uft[0].dateTime;
            const actTimeOut = onDuty && uft[uft.length - 1].dateTime;
            const lastId = onDuty && uft[uft.length - 1]._id;
            const uftLog = onDuty && uft.map((log) => log);

            const noTimeOut =
              onDuty && uftLog.length % 2 === 1 && `no time out,`;

            const late =
              onDuty &&
              timeDiff(actTimeIn, timeIn) > 0 &&
              timeDiff(actTimeIn, timeIn);

            const overtime =
              onDuty && timeDiff(actTimeOut, timeOut) > 0
                ? timeDiff(actTimeOut, timeOut).format("HH:mm:ss")
                : false;

            const ot30mins =
              overtime &&
              timeDiff(`${date} ${overtime}`, `${date} 00:30:00`) >= 0 &&
              `Overtime: ${overtime}`;

            const underTime =
              onDuty && !noTimeOut && timeDiff(actTimeOut, timeOut) < 0
                ? `Under-time: ${timeDiff(timeOut, actTimeOut).format("HH:mm:ss")},`
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
              onDuty &&
              logs &&
              pureTimeAdder(...logs) > 0 &&
              pureTimeAdder(...logs);

            const stayInOfficeHrs =
              dutyHrs &&
              `Office stay: ${timeDiff(actTimeOut, actTimeIn).format("HH:mm:ss")},`;

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
                brkDuration,
              );

            const overBrkStatus =
              dutyHrs &&
              overBrk > 0 &&
              `Over break: ${overBrk.format("HH:mm:ss")},`;

            const timeInAndOutDiff =
              onDuty && timeDiff(timeOut, timeIn).format("HH:mm:ss");
            const expectedDutyHrs =
              dutyHrs &&
              onDuty &&
              timeDiff(`${date} ${timeInAndOutDiff}`, brkDuration);

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

            const wCreated = wage?.data?.length > 0;
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
              event.every((obj) => !eventTypes.includes(obj.eventType)) &&
              "ordinary";

            const specialDay =
              event.some((obj) => obj.eventType.includes("special")) &&
              "special";

            const regularDay =
              event.some((obj) => obj.eventType.includes("regular")) &&
              "regular";

            const dayOffDay =
              event.some((obj) => obj.eventType.includes("dayOff")) && "dayOff";

            const isOrdinaryDay =
              ordinaryDay &&
              !specialDay &&
              !regularDay &&
              !dayOffDay &&
              "ordinary";

            const isSpecialDay =
              !ordinaryDay &&
              specialDay &&
              !regularDay &&
              !dayOffDay &&
              "special";

            const isRegularDay =
              !ordinaryDay && regularDay && !dayOffDay && "regular";

            const isDayOffSpecial =
              !ordinaryDay &&
              specialDay &&
              !regularDay &&
              dayOffDay &&
              "dayOffSpecial";

            const isDayOffRegular =
              !ordinaryDay && regularDay && dayOffDay && "dayOffRegular";

            const isDayOff =
              !ordinaryDay &&
              !specialDay &&
              !regularDay &&
              dayOffDay &&
              "dayOff";

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
            function timeToNum(time) {
              if (time === false) return 0;
              const parsedDutyHrs = dayjs(time, "HH:mm:ss");
              return (
                parsedDutyHrs.hour() +
                parsedDutyHrs.minute() / 60 +
                parsedDutyHrs.second() / 3600
              );
            }

            const dutyHrsInNum = timeToNum(finalDutyHrs);
            const otHrsInNum = timeToNum(ot30mins);
            const dailyWPerHr = w && w.wage / 8;
            const dailyWPerHrInEvent = dailyWPerHr * numeral(dutyW).value();
            const dailyWPerHrInOt = dailyWPerHr * numeral(otW).value();
            const dailyWPerHrInOtEvent =
              dailyWPerHrInOt * numeral(dutyW).value();

            const dutyHrsWF = dailyWPerHrInEvent * dutyHrsInNum;
            const dutyHrsWOTf = dailyWPerHrInOtEvent * otHrsInNum;

            const dayOffWF = numeral(dayOffW).value() * numeral(dailyW).value();

            const totalW = dayOffWF + dutyHrsWF + dutyHrsWOTf;

            //payroll
            const p = e.event.data.p[0];

            //incentives
            const allowW = w && w.allowance;

            const dailyAllowanceId =
              event.length > 0 &&
              event.find((obj) => obj.eventName.includes("Daily Allowance"))
                ?._id;

            return (
              <div className="text-wrap text-xs">
                <p>
                  {e.title}: {dayOff} {onDuty} {absent}
                  {onDuty &&
                    `| ${dayjs(timeIn).format("hh:mm a")} to ${dayjs(timeOut).format("hh:mm a")}, Brk: ${dayjs(brkDuration).format("hh:mm:ss")}`}
                </p>
                {stayInOfficeHrs} {finalDutyHrs && `Duty hrs: ${finalDutyHrs},`}{" "}
                {ot30mins}
                <div className="flex flex-col text-red-300">
                  {absent} {noTimeOut}{" "}
                  {late && `Late: ${late.format("HH:mm:ss")},`} {underTime}
                  {overBrkStatus}
                  {ot30mins && (
                    <button
                      className={`${style}`}
                      disabled={isPending}
                      onClick={() =>
                        mutate(
                          Api.simplePatchNull(
                            `/userFinalTimelogBEPatchOne/${lastId}`,
                            "userFinalTimelogFEPatchOne",
                            "userFinalTimelogBEPatchOne",
                            { dateTime: timeOut },
                          ),
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
                        {dayjs(log.dateTime).format("hh:mm:ss a")} || edit
                      </Link>
                    ))}
                </ul>
                {notDayOff && (
                  <button
                    onClick={() =>
                      mutate(
                        Api.simplePostNull(
                          "/userFinalTimelogBEPostAllUnique",
                          "userFinalTimelogFEPostAllUnique",
                          "userFinalTimelogBEPostAllUnique",
                          {
                            uniqueData: uuidv4(),
                            userId,
                            name,
                            mode,
                            dateTime: timeOut,
                            title: e.title,
                          },
                        ),
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
                        <div>
                          Date Hired: {dayjs(dateHired).format("YYYY MMMM, DD")}
                        </div>
                        <div>Employment type: {isReg}</div>
                        <div>Day: {day}</div>
                        <div>
                          Daily wage: ₱{numeral(dailyW).format("0,0.00")}
                        </div>
                        <div>
                          Daily wage per hour: ₱
                          {numeral(dailyWPerHr).format("0,0.00")}
                        </div>
                        <div>
                          Daily Allowance: ₱{numeral(allowW).format("0,0.00")}
                        </div>
                        <div>
                          SSS Allowance: ₱
                          {numeral(sssAllowance).format("0,0.00")}
                        </div>
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
                      <p className="mt-2 text-center text-blue-300">
                        Wage calculation:
                      </p>
                      <div className="grid grid-cols-2 gap-5 gap-x-10">
                        <div>
                          <div>
                            <div>
                              Default wage per hr: ₱
                              {numeral(dailyWPerHr).format("0,0.00")}
                            </div>
                            <div>
                              Wage per hr in {dayW}: ₱
                              {numeral(dailyWPerHrInEvent).format("0,0.00")}
                            </div>
                            <p>
                              (₱{numeral(dailyWPerHr).format("0,0.00")} X{" "}
                              {dutyW} = ₱
                              {numeral(dailyWPerHrInEvent).format("0,0.00")})
                            </p>
                            <p>X</p>
                            <div>
                              Duty hours: {numeral(dutyHrsInNum).format("0.00")}{" "}
                              hrs
                            </div>
                            <div className="border-t text-green-400">
                              Duty hrs wage: ₱
                              {numeral(dutyHrsWF).format("0,0.00")}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div>
                            Daily wage: ₱{numeral(dailyW).format("0,0.00")}
                          </div>
                          <p>X</p>
                          <div>Day-off wage: {dayOffW}</div>
                          <div className="border-t text-green-400">
                            Day-off wage: ₱{numeral(dayOffWF).format("0,0.00")}
                          </div>
                        </div>
                        <div>
                          <div>
                            Default wage per OT hr: ₱
                            {numeral(dailyWPerHrInOt).format("0,0.00")}
                          </div>
                          <p>
                            (₱{numeral(dailyWPerHr).format("0,0.00")} X {otW} =
                            ₱{numeral(dailyWPerHrInOt).format("0,0.00")})
                          </p>
                          <div>
                            Wage per OT hr in {dayW}: ₱
                            {numeral(dailyWPerHrInOtEvent).format("0,0.00")}
                          </div>
                          <p>
                            (₱{numeral(dailyWPerHrInOt).format("0,0.00")} X{" "}
                            {dutyW} = ₱
                            {numeral(dailyWPerHrInOtEvent).format("0,0.00")})
                          </p>
                          <p>X</p>
                          <div>
                            OT hrs: {numeral(otHrsInNum).format("0.00")}
                          </div>
                          <div className="border-t text-green-400">
                            Duty OT hrs wage: ₱
                            {numeral(dutyHrsWOTf).format("0,0.00")}
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <p>
                            Day-off wage: ₱{numeral(dayOffWF).format("0,0.00")}
                          </p>
                          <p>
                            Duty OT hrs wage: ₱
                            {numeral(dutyHrsWOTf).format("0,0.00")}
                          </p>
                          <p>
                            Duty hrs wage: ₱
                            {numeral(dutyHrsWF).format("0,0.00")}
                          </p>
                          <p className="border-t text-emerald-400">
                            Total Wage: ₱{numeral(totalW).format("0,0.00")}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        Daily Allowance: ₱{numeral(allowW).format("0,0.00")}
                      </div>
                      {notDayOff && !absent && (
                        <div className="flex justify-center">
                          {p && notDayOff ? (
                            <div className="mt-2 flex w-full justify-evenly">
                              <EditBtn
                                onClick={async () => {
                                  mutate(
                                    Api.simplePatchNull(
                                      `/payrollBEPatchOne/${p._id}`,
                                      "payrollFEPatchOne",
                                      "payrollBEPatchOne",
                                      {
                                        defWagePerHr: `₱${numeral(dailyWPerHr).format("0,0.00")}`,
                                        wagePerHrWEvent: `₱${numeral(dailyWPerHrInEvent).format("0,0.00")}`,
                                        dutyHrs:
                                          numeral(dutyHrsInNum).format("0.00"),
                                        dutyHrsW: `₱${numeral(dutyHrsWF).format("0,0.00")}`,

                                        defOTWagePerHr: `₱${numeral(dailyWPerHrInOt).format("0,0.00")}`,
                                        OTwagePerHrWEvent: `₱${numeral(dailyWPerHrInOtEvent).format("0,0.00")}`,
                                        OTHrs:
                                          numeral(otHrsInNum).format("0.00"),
                                        OTHrsW: `₱${numeral(dutyHrsWOTf).format("0,0.00")}`,

                                        dailyW: `₱${numeral(dailyW).format("0,0.00")}`,
                                        dailyWMulti: wageRule.day,
                                        dayOffW: `₱${numeral(dayOffWF).format("0,0.00")}`,

                                        sssAllowance: `₱${numeral(sssAllowance).format("0,0.00")}`,
                                        totalW: `₱${numeral(totalW).format("0,0.00")}`,

                                        stats: {
                                          late: late
                                            ? late.format("HH:mm:ss")
                                            : "",
                                          overtime: overtime ? overtime : "",
                                          underTime: underTime
                                            ? timeDiff(
                                                timeOut,
                                                actTimeOut,
                                              ).format("HH:mm:ss")
                                            : "",
                                          overBrk: overBrkStatus
                                            ? overBrk.format("HH:mm:ss")
                                            : "",
                                        },

                                        event: dayW,
                                      },
                                    ),
                                  ),
                                    Number(allowW) !== 0 &&
                                      mutate(
                                        Api.simplePatchNull(
                                          `/eventBEPatchOne/${dailyAllowanceId}`,
                                          "eventFEPatchOne",
                                          "eventBEPatchOne",
                                          {
                                            reward:
                                              numeral(allowW).format("0,0.00"),
                                          },
                                        ),
                                      );
                                }}
                              >
                                Update Payroll and Allowance
                              </EditBtn>
                              <DeleteBtn
                                onClick={async () => {
                                  const confirmDelete = await swalAlert(
                                    "Yes, delete Payroll and Allowance",
                                  );
                                  if (confirmDelete.isConfirmed) {
                                    mutate(
                                      Api.simpleDeleteNull(
                                        `payrollBEDeleteOne/${p._id}`,
                                        "payrollFEDeleteOne",
                                        "payrollBEDeleteOne",
                                      ),
                                    );
                                    Number(allowW) !== 0 &&
                                      mutate(
                                        Api.simpleDeleteNull(
                                          `eventBEDeleteOne/${dailyAllowanceId}`,
                                          "eventFEDeleteOne",
                                          "eventBEDeleteOne",
                                        ),
                                      );
                                  }
                                }}
                              >
                                Delete Payroll and Allowance
                              </DeleteBtn>
                            </div>
                          ) : (
                            <SaveBtn
                              isPending={isPending}
                              onClick={async () => {
                                mutate(
                                  Api.simplePostNull(
                                    "/payrollBEPostAllUnique",
                                    "payrollFEPostAllUnique",
                                    "payrollBEPostAllUnique",
                                    {
                                      uniqueData: us.uniqueData,

                                      defWagePerHr: `₱${numeral(dailyWPerHr).format("0,0.00")}`,
                                      wagePerHrWEvent: `₱${numeral(dailyWPerHrInEvent).format("0,0.00")}`,
                                      dutyHrs:
                                        numeral(dutyHrsInNum).format("0.00"),
                                      dutyHrsW: `₱${numeral(dutyHrsWF).format("0,0.00")}`,

                                      defOTWagePerHr: `₱${numeral(dailyWPerHrInOt).format("0,0.00")}`,
                                      OTwagePerHrWEvent: `₱${numeral(dailyWPerHrInOtEvent).format("0,0.00")}`,
                                      OTHrs: numeral(otHrsInNum).format("0.00"),
                                      OTHrsW: `₱${numeral(dutyHrsWOTf).format("0,0.00")}`,

                                      dailyW: `₱${numeral(dailyW).format("0,0.00")}`,
                                      dailyWMulti: wageRule.day,
                                      dayOffW: `₱${numeral(dayOffWF).format("0,0.00")}`,

                                      sssAllowance: `₱${numeral(sssAllowance).format("0,0.00")}`,
                                      totalW: `₱${numeral(totalW).format("0,0.00")}`,

                                      stats: {
                                        late: late
                                          ? late.format("HH:mm:ss")
                                          : "",
                                        overtime: ot30mins ? overtime : "",
                                        underTime: underTime
                                          ? timeDiff(
                                              timeOut,
                                              actTimeOut,
                                            ).format("HH:mm:ss")
                                          : "",
                                        overBrk: overBrkStatus
                                          ? overBrk.format("HH:mm:ss")
                                          : "",
                                      },

                                      event: dayW,
                                      userId: us.userId,
                                      firstName: us.firstName,
                                    },
                                  ),
                                );
                                Number(allowW) !== 0 &&
                                  mutate(
                                    Api.simplePostNull(
                                      "/eventBEsimplePostOne",
                                      "eventFEsimplePostOne",
                                      "eventBEsimplePostOne",
                                      {
                                        date,
                                        eventName: "Daily Allowance",
                                        firstName: us.firstName,
                                        eventDescription: "",
                                        eventType: "reward",
                                        userId,
                                        penalty: "",
                                        benefitCost: "",
                                        reward:
                                          numeral(allowW).format("0,0.00"),
                                      },
                                    ),
                                  );
                              }}
                            >
                              Create Payroll and Allowance
                            </SaveBtn>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          }
          case "US": {
            const schedule =
              e.event.data.timeIn === "day-off" ||
              e.event.data.timeOut === "day-off"
                ? `Day-off`
                : `${e.event.data.timeIn} to ${e.event.data.timeOut}, Brk: ${e.event.data.brkDuration}`;

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
          case "UT": {
            const timelog = e.event.data.map((log) =>
              dayjs(log.dateTime).format("hh:mm:ss a| "),
            );
            return (
              <div className="text-wrap text-xs text-green-300">
                {e.title}: {timelog}
              </div>
            );
          }
          case "UFT": {
            const timelog = e.event.data.map((log) =>
              dayjs(log.dateTime).format("hh:mm:ss a| "),
            );
            return (
              <div className="text-wrap text-xs text-purple-300">
                {e.title}: {timelog}
              </div>
            );
          }
          case "E": {
            return (
              <div className="flex text-teal-300">
                <Link
                  to={`eventForm/${e.event.data._id}`}
                  state={e.event}
                  className={`${style} text-wrap`}
                >
                  {e.title}: {e.event.data.eventName} || edit -{" "}
                  {e.event.data.eventType},{" "}
                  {e.event.data?.description &&
                    `Description${e.event.data?.description}`}
                </Link>
              </div>
            );
          }
          case "P": {
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
          default: {
            return <div className="text-xs">{e.title}</div>;
          }
        }
      },
    }),
    [isPending, mutate, wage, wageRate],
  );

  const showPerformanceWarn =
    showS || showUT || showUSch || showUFT || showE || showP;
  return (
    <>
      {formName}
      <div className="relative flex h-full w-full flex-col pt-2">
        <Option topRight={true}>
          <Icon>
            <EyeIcon></EyeIcon>
            <H1mdAndUp>View</H1mdAndUp>
          </Icon>
          <Checkbox id="showUSch" checked={showUSch} setChecked={showUSchSet}>
            User Schedule
          </Checkbox>
          <Checkbox id="showUT" checked={showUT} setChecked={showUTSet}>
            User Timelog
          </Checkbox>
          <Checkbox id="showUFT" checked={showUFT} setChecked={showUFTSet}>
            User Final Timelog
          </Checkbox>
          <Checkbox id="showS" checked={showS} setChecked={showSSet}>
            User Status || edit
          </Checkbox>
          <Checkbox id="showE" checked={showE} setChecked={showESet}>
            User Event || edit
          </Checkbox>
          <Checkbox id="showP" checked={showP} setChecked={showPSet}>
            User Payroll
          </Checkbox>
          <Checkbox id="showSum" checked={showSum} setChecked={showSumSet}>
            Show Summary
          </Checkbox>
        </Option>
        <p
          className={`${showPerformanceWarn ? "animate-pulse" : "animate-none opacity-0"} text-xs text-yellow-600 transition-all duration-300 hover:z-20`}
        >
          Viewing events might slow down the system, please be patient.
        </p>
        {dayjs(date).format("YYYY MMMM, DD")}
        <div className={`${showSum ? "h-screen" : "h-full"} `}>
          <Calendar
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            components={components}
            date={date}
            localizer={localizer}
            events={scheduleList}
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
        {showSum && (
          <>
            {showE && showP ? (
              ""
            ) : (
              <p className="animate-pulse text-red-500">
                Please mark check both the user event and payroll for proper
                calculation!
              </p>
            )}
            <div className="grid grid-cols-2 text-start text-xs">
              <p>
                Total Wage for this month: ₱
                {numeral(monthlyWage).format("0,0.00")}
              </p>
              <p>15th Salary: ₱{numeral(fifteenthSal).format("0,0.00")}</p>
              <p>
                Total SSS for this month: ₱
                {numeral(monthlySSS).format("0,0.00")}
              </p>
              <p>
                SSS: ₱{numeral(eePlusEc).format("0,0.00")}, ER: ₱
                {numeral(ec).format("0,0.00")},{" "}
                <span className="text-red-400">
                  EE: ₱{numeral(ee).format("0,0.00")}
                </span>
              </p>
              <p>
                Pag-ibig: ₱{numeral(pagIbigTotal).format("0,0.00")}, ER: ₱
                {numeral(pagIbigEE).format("0,0.00")},{" "}
                <span className="text-red-400">
                  EE: ₱{numeral(pagIbigER).format("0,0.00")}
                </span>
              </p>
              <p>
                PhilHealth: ₱{numeral(philHealthTotal).format("0,0.00")}, ER: ₱
                {numeral(philHealthEE).format("0,0.00")},{" "}
                <span className="text-red-400">
                  EE: ₱{numeral(philHealthER).format("0,0.00")}
                </span>
              </p>
              <p className="text-blue-400">
                Net wage 15th Salary: ₱
                {numeral(fifteenthSalNet).format("0,0.00")}
              </p>
              <p className="text-blue-400">
                Last day of the month Salary: ₱
                {numeral(fifteenthSal).format("0,0.00")}
              </p>
              <p>Total duty hrs: {numeral(totalDutyHrs).format("0,0.00")}</p>
              <p>Total Late(s): {totalLate}</p>
              <p>Total overBrk(s): {totalOverBrk}</p>
              <p>Total under-time(s): {totalUnderTime}</p>
            </div>
            <div className="mt-2 grid grid-cols-2 border-t text-start text-xs">
              <div>
                <p className="text-blue-400">
                  Total Deductions: ₱{numeral(penalties).format("0,0.00")}
                </p>
                <StatsMap arr={penaltyMap} type={"penalty"}></StatsMap>
              </div>
              <div>
                <p className="text-blue-400">
                  Total BenefitCost: ₱{numeral(benefitCosts).format("0,0.00")}
                </p>
                <StatsMap arr={benefitCostsMap} type={"benefitCost"}></StatsMap>
              </div>
              <div>
                <p className="text-blue-400">
                  Total Incentives: ₱{numeral(rewards).format("0,0.00")}
                </p>
                <StatsMap arr={rewardsMap} type={"reward"}></StatsMap>
              </div>
              <div>
                {incentiveStats > 0 && (
                  <p className="text-blue-400">
                    Incentives to be given: ₱
                    {numeral(incentiveStats).format("0,0.00")}
                  </p>
                )}
                {incentiveStats < 0 && (
                  <p className="text-red-400">
                    Deductions to be carry over the next month: ₱
                    {numeral(incentiveStats).format("0,0.00")}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

Calendars.propTypes = {
  children: PropTypes.node,
  date: PropTypes.object,
  dateSet: PropTypes.func,
  defSchedule: PropTypes.object,
  formName: PropTypes.string,
  minUS: PropTypes.bool,
  myEvents: PropTypes.array,
};

function StatsMap({ arr, type }) {
  return (
    <div className="ml-2">
      {arr.slice().map((obj, i) => (
        <div key={i}>
          {dayjs(obj.data.date).format("DD-ddd")}, {obj.data.eventName}, ₱
          {numeral(obj.data[type]).format("0,0.00")}
        </div>
      ))}
    </div>
  );
}

StatsMap.propTypes = {
  arr: PropTypes.array,
  type: PropTypes.string,
};
