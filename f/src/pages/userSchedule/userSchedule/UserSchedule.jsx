import { CloudArrowUpIcon, Squares2X2Icon } from "@heroicons/react/24/solid";

import ContentBox0 from "../../../reusable/components/basic0/ContentBox0";
import Icon from "../../../reusable/components/basic0/Icon";
import OptionAutoClose from "../../../reusable/components/basic1/OptionAutoClose";
import H1mdAndUp from "../../../reusable/components/basic0/H1mdAndUp";
import Checkbox from "../../../reusable/components/basic0/Checkbox";
import useUserSchedule from "./useUserSchedule";
import BtnGoBack from "../../../reusable/components/basic2/BtnGoBack";
import ContentBox1 from "../../../reusable/components/basic0/ContentBox1";
import DateRangePicker from "../../../reusable/components/basic0/DateRangePicker";
import { useGlobal } from "../../../context/globalHook";
import Btn from "../../../reusable/components/basic0/Btn";
import BtnLink from "../../../reusable/components/basic0/BtnLink";
import { formatDate } from "../../../lib/utils0";

export default function UserSchedule() {
  const {
    showUS,
    showUSSet,
    showUF,
    showUFSet,
    scheduleListToSave,
    isPending,
    userSchedulePostAllUnique,
  } = useUserSchedule();
  const { value, valueSet } = useGlobal();
  return (
    <ContentBox0>
      <ContentBox1>
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
        </OptionAutoClose>
        <div className="flex w-full justify-end">
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
            <Btn onClick={userSchedulePostAllUnique} isPending={isPending}>
              Create Schedules from {formatDate(value.startDate)} to{" "}
              {formatDate(value.endDate)}.
            </Btn>
          )}
          {showUF && (
            <BtnLink to="userTimeLogsForm">
              <Icon>
                <CloudArrowUpIcon></CloudArrowUpIcon> <p>Upload User Timelog</p>
              </Icon>
            </BtnLink>
          )}
        </div>
      </ContentBox1>
    </ContentBox0>
  );
}
