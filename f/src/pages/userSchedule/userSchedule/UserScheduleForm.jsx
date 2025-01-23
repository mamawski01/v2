import { useParams } from "react-router-dom";
import { timeArr } from "../../../lib/utils0";
import FormCommon from "../../../reusable/components/basic3/FormCommon";
import {
  userScheduleGetOne,
  userSchedulePatchOne,
} from "../../../reusable/hooks/useHook1";

export default function UserScheduleForm() {
  const { uidSchedule } = useParams();
  const edit = Boolean(uidSchedule);
  return (
    <FormCommon
      title={"User Schedule Form"}
      id={uidSchedule}
      edit={edit}
      getOne={userScheduleGetOne}
      patchOne={userSchedulePatchOne}
      fields={[
        {
          field: "timeInSelect",
          type: "select",
          options: timeArr().map((time) => time),
          rules: {
            validate: (value) => {
              if (!value?.value && !value?.label) {
                return `timeInSelect is required.`;
              }
              return true;
            },
          },
        },
        {
          field: "timeOutSelect",
          type: "select",
          options: timeArr().map((time) => time),
          rules: {
            validate: (value) => {
              if (!value?.value && !value?.label) {
                return `timeOutSelect is required.`;
              }
              return true;
            },
          },
        },
        {
          field: "brkDurationSelect",
          type: "select",
          options: ["15 mins", "30 mins", "45 mins", "60 mins"],
          rules: {
            validate: (value) => {
              if (!value?.value && !value?.label) {
                return `brkDurationSelect is required.`;
              }
              return true;
            },
          },
        },
      ]}
    ></FormCommon>
  );
}
