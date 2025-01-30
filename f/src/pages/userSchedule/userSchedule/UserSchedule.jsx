import PropTypes from "prop-types";
import { CloudArrowUpIcon, Squares2X2Icon } from "@heroicons/react/24/solid";

import ContentBox0 from "../../../reusable/components/basic0/ContentBox0";
import Icon from "../../../reusable/components/basic0/Icon";
import OptionAutoClose from "../../../reusable/components/basic1/OptionAutoClose";
import H1mdAndUp from "../../../reusable/components/basic0/H1mdAndUp";
import Checkbox from "../../../reusable/components/basic0/Checkbox";
import useUserSchedule from "./useUserSchedule";
import BtnGoBack from "../../../reusable/components/basic2/BtnGoBack";
import DateRangePicker from "../../../reusable/components/basic0/DateRangePicker";
import { useGlobal } from "../../../context/globalHook";
import Btn from "../../../reusable/components/basic0/Btn";
import BtnLink from "../../../reusable/components/basic0/BtnLink";
import { formatDate, formatName, toNumb, toPeso } from "../../../lib/utils0";
import CalendarBig from "../../../reusable/components/basic4/CalendarBig";
import dayjs from "dayjs";

export default function UserSchedule() {
  const {
    user,
    showUS,
    showUSSet,
    showUF,
    showUFSet,
    scheduleListToSave,
    isPending,
    userSchedulePostAllUnique,
    showUSch,
    showUSchSet,
    showUT,
    showUTSet,
    showUFT,
    showUFTSet,
    showS,
    showSSet,
    myEvents,
    components,
    showE,
    showESet,
    showP,
    showPSet,
    showSum,
    showSumSet,
    wageRate,
  } = useUserSchedule();
  const { value, valueSet } = useGlobal();

  const payroll = myEvents.filter((obj) => obj.title.includes("P"));

  const monthlyWage = payroll
    .map((obj) => toNumb(obj.data.totalW))
    .reduce((a, b) => a + b, 0);

  const monthlySSS = payroll
    .map((obj) => toNumb(obj.data.sssAllowance))
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

  const event = myEvents.filter((obj) => obj.title.includes("E"));

  const penalties = event
    .map((obj) => toNumb(obj.data.penalty))
    .reduce((a, b) => a + b, 0);
  const penaltyMap = event.filter((obj) =>
    obj.data.eventType.includes("penalty"),
  );

  const benefitCosts = event
    .map((obj) => toNumb(obj.data.benefitCost))
    .reduce((a, b) => a + b, 0);
  const benefitCostsMap = event.filter((obj) =>
    obj.data.eventType.includes("benefits"),
  );

  const rewards = event
    .map((obj) => toNumb(obj.data.reward))
    .reduce((a, b) => a + b, 0);
  const rewardsMap = event.filter((obj) =>
    obj.data.eventType.includes("reward"),
  );

  const incentiveStats = rewards - penalties;
  return (
    <ContentBox0>
      <header className="sticky top-0 z-30 flex h-12 items-center justify-center border-b border-gray-300/20 bg-black/80 backdrop-blur-sm">
        <OptionAutoClose>
          <Icon>
            <Squares2X2Icon></Squares2X2Icon>
            <H1mdAndUp>Options</H1mdAndUp>
          </Icon>
          <Checkbox id="showUS" checked={showUS} setChecked={showUSSet}>
            Create User Schedule
          </Checkbox>
          <Checkbox id="showUF" checked={showUF} setChecked={showUFSet}>
            Upload User Timelog
          </Checkbox>

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
        </OptionAutoClose>
        <div className="flex w-full items-center justify-between">
          <div></div>
          <div>
            <h1 className="max-w-96 text-wrap">
              User Schedule,{" "}
              {formatName(
                user.data.firstName,
                user.data.lastName,
                user.data.dataId,
              )}
            </h1>
          </div>
          <div>
            <BtnGoBack></BtnGoBack>
          </div>
        </div>
      </header>
      <div className="pt-3">
        <div className="flex flex-col items-center justify-center gap-1">
          {showUS && (
            <DateRangePicker
              value={value}
              valueSet={valueSet}
              placeholder={"Click here to create US."}
            ></DateRangePicker>
          )}
          {scheduleListToSave.length > 0 && (
            <div>
              <Btn onClick={userSchedulePostAllUnique} isPending={isPending}>
                Create Schedules from {formatDate(value.startDate, true)} to{" "}
                {formatDate(value.endDate, true)}.
              </Btn>
            </div>
          )}
          {showUF && (
            <div>
              <BtnLink to="userTimeLogForm">
                <Icon>
                  <CloudArrowUpIcon></CloudArrowUpIcon>
                  <p>Upload User Timelog</p>
                </Icon>
              </BtnLink>
            </div>
          )}
        </div>
        <CalendarBig
          myEvents={myEvents}
          components={components}
          to="eventOptions"
        ></CalendarBig>
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
                Total Wage for this month:
                {toPeso(monthlyWage)}
              </p>
              <p>15th Salary: {toPeso(fifteenthSal)}</p>
              <p>Total SSS for this month: {toPeso(monthlySSS)}</p>
              <p>
                SSS: {toPeso(eePlusEc)}, ER: {toPeso(ec)},{" "}
                <span className="text-red-400">EE: {toPeso(ee)}</span>
              </p>
              <p>
                Pag-ibig: {toPeso(pagIbigTotal)}, ER:
                {toPeso(pagIbigEE)},{" "}
                <span className="text-red-400">EE: {toPeso(pagIbigER)}</span>
              </p>
              <p>
                PhilHealth: {toPeso(philHealthTotal)}, ER:
                {toPeso(philHealthEE)},{" "}
                <span className="text-red-400">EE: {toPeso(philHealthER)}</span>
              </p>
              <p className="text-blue-400">
                Net wage 15th Salary:
                {toPeso(fifteenthSalNet)}
              </p>
              <p className="text-blue-400">
                Last day of the month Salary:
                {toPeso(fifteenthSal)}
              </p>
              <p>Total duty hrs: {toPeso(totalDutyHrs)}</p>
              <p>Total Late(s): {totalLate}</p>
              <p>Total overBrk(s): {totalOverBrk}</p>
              <p>Total under-time(s): {totalUnderTime}</p>
            </div>
            <div className="mt-2 grid grid-cols-2 border-t text-start text-xs">
              <div>
                <p className="text-blue-400">
                  Total Deductions: {toPeso(penalties)}
                </p>
                <StatsMap arr={penaltyMap} type={"penalty"}></StatsMap>
              </div>
              <div>
                <p className="text-blue-400">
                  Total BenefitCost: {toPeso(benefitCosts)}
                </p>
                <StatsMap arr={benefitCostsMap} type={"benefitCost"}></StatsMap>
              </div>
              <div>
                <p className="text-blue-400">
                  Total Incentives: {toPeso(rewards)}
                </p>
                <StatsMap arr={rewardsMap} type={"reward"}></StatsMap>
              </div>
              <div>
                {incentiveStats > 0 && (
                  <p className="text-blue-400">
                    Incentives to be given:
                    {toPeso(incentiveStats)}
                  </p>
                )}
                {incentiveStats < 0 && (
                  <p className="text-red-400">
                    Deductions to be carry over the next month:
                    {toPeso(incentiveStats)}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ContentBox0>
  );
}

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
  const er = toNumb(rules.rules.ER) * roundedSalary;
  const ee = toNumb(rules.rules.EE) * roundedSalary;
  const ec = er + toNumb(rules.rules.EC);
  const eePlusEc = ee + ec;
  //pagIbig
  const pagIbig = wageRate.data.pagIbig;
  const pagIbigEE = toNumb(pagIbig.rules.EE);
  const pagIbigER = toNumb(pagIbig.rules.ER);
  const pagIbigTotal = pagIbigEE + pagIbigER;
  //philHealth
  const philHealth = wageRate.data.philHealth;
  const philHealthEE = toNumb(philHealth.rules.EE);
  const philHealthER = toNumb(philHealth.rules.ER);
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
    .map((obj) => toNumb(obj.data.dutyHrs))
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

function StatsMap({ arr, type }) {
  return (
    <div className="ml-2">
      {arr.slice().map((obj, i) => (
        <div key={i}>
          {dayjs(obj.data.date).format("DD-ddd")}, {obj.data.eventName},
          {toPeso(obj.data[type])}
        </div>
      ))}
    </div>
  );
}

StatsMap.propTypes = {
  arr: PropTypes.array,
  type: PropTypes.string,
};
