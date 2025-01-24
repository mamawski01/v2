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
import { formatDate, formatName } from "../../../lib/utils0";
import CalendarBig from "../../../reusable/components/basic4/CalendarBig";

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
  } = useUserSchedule();
  const { value, valueSet } = useGlobal();
  return (
    <ContentBox0>
      <div className="pt-3">
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
        </OptionAutoClose>
        <div className="flex w-full justify-between">
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
                Create Schedules from {formatDate(value.startDate)} to{" "}
                {formatDate(value.endDate)}.
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
      </div>
    </ContentBox0>
  );
}
