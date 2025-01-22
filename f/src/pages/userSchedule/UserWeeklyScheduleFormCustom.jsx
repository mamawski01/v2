import { useLocation, useParams } from "react-router-dom";
import {
  useFetch,
  useMutate,
  weeklyScheduleGetOne,
  weeklySchedulePatch,
} from "../../reusable/hooks/useHook1";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  onError,
  onSubmitForm,
  trimStrings,
} from "../../reusable/components/basic2/FormHelper";
import Loading from "../../reusable/components/basic1/Loading";
import ContentBox0 from "../../reusable/components/basic0/ContentBox0";
import H1MainTitle from "../../reusable/components/basic0/H1MainTitle";
import Form from "../../reusable/components/basic2/Form";
import Table from "../../reusable/components/basic1/Table";
import Thead from "../../reusable/components/basic1/Thead";
import TheadTr from "../../reusable/components/basic1/TheadTr";
import Th from "../../reusable/components/basic1/Th";
import TbodyTr from "../../reusable/components/basic1/TbodyTr";
import Td from "../../reusable/components/basic1/Td";
import Selector from "../../reusable/components/basic0/Selector";
import { patch } from "../../api/api";
import { formatName, timeArr } from "../../lib/utils0";

const daysOfWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function UserWeeklyScheduleFormCustom() {
  const location = useLocation();
  const dataInfo = location.state;
  const { control, formState, handleSubmit, reset, getValues } = useForm();
  const { errors } = formState;
  const { mutate, isPending } = useMutate();

  function superReset() {
    reset({ lol: {} });
  }
  const { id } = useParams();
  const edit = Boolean(id);

  const { data } = useFetch(weeklyScheduleGetOne + id, edit, true);

  const schedule = data?.data;
  useEffect(() => {
    if (schedule && edit) {
      const formdata = Object.fromEntries(
        daysOfWeek.flatMap((day) => {
          return [
            [
              `${day}TimeIn`,
              {
                value: schedule[day].timeIn,
                label: schedule[day].timeIn,
              },
            ],
            [
              `${day}TimeOut`,
              {
                value: schedule[day].timeOut,
                label: schedule[day].timeOut,
              },
            ],
          ];
        }),
      );
      const finalFormData = {
        ...formdata,
        brkDuration: {
          value: schedule.brkDuration,
          label: schedule.brkDuration,
        },
      };
      console.log(finalFormData);
      reset(finalFormData);
    }
  }, [edit, data, reset, schedule]);

  async function onSubmit(data) {
    const trimmedData = trimStrings(data);
    const formData = daysOfWeek.reduce((acc, day) => {
      acc[day] = {
        timeIn: trimmedData[`${day}TimeIn`].value,
        timeOut: trimmedData[`${day}TimeOut`].value,
        day: day,
      };
      return acc;
    }, {});
    const brkDurationValues = getValues().brkDuration.value;
    const finalFormData = { ...formData, brkDuration: brkDurationValues };
    console.log(finalFormData);
    mutate(
      edit
        ? patch(
            weeklySchedulePatch + id,
            await onSubmitForm(finalFormData, "text"),
          )
        : new Error("Can edit only"),
    );
  }

  if (!schedule) return <Loading></Loading>;

  if (schedule) {
    return (
      <ContentBox0>
        <H1MainTitle>User Weekly Schedule Form</H1MainTitle>

        <Form
          onSubmit={handleSubmit(onSubmit, onError)}
          isPending={isPending}
          superReset={superReset}
          edit={edit}
          formName={
            edit &&
            formatName(dataInfo.firstName, dataInfo.lastName, dataInfo.dataId)
          }
        >
          <Table>
            <Thead>
              <TheadTr>
                <Th>Day</Th>
                <Th>TimeIn</Th>
                <Th>TimeOut</Th>
              </TheadTr>
            </Thead>
            <tbody>
              {daysOfWeek.map((day, i) => (
                <TbodyTr key={i}>
                  <Td>{schedule[day].day}</Td>
                  <Td>
                    <Selector
                      id={`${day}TimeIn`}
                      Controller={Controller}
                      control={control}
                      errors={errors}
                      transparentBorder={true}
                      rules={{
                        validate: (value) => {
                          if (!value?.value && !value?.label) {
                            return `${day}TimeIn is required.`;
                          }
                          return true;
                        },
                      }}
                      options={timeArr().map((time) => ({
                        value: time,
                        label: time,
                      }))}
                    />
                  </Td>
                  <Td>
                    <Selector
                      id={`${day}TimeOut`}
                      Controller={Controller}
                      control={control}
                      errors={errors}
                      transparentBorder={true}
                      rules={{
                        validate: (value) => {
                          if (!value?.value && !value?.label) {
                            return `${day}TimeOut is required.`;
                          }
                          return true;
                        },
                      }}
                      options={timeArr().map((time) => ({
                        value: time,
                        label: time,
                      }))}
                    />
                  </Td>
                </TbodyTr>
              ))}
              <TbodyTr>
                <Td>Break Duration</Td>
                <Td>
                  <Selector
                    id={`brkDuration`}
                    Controller={Controller}
                    control={control}
                    errors={errors}
                    transparentBorder={true}
                    options={[
                      { value: "15 mins", label: "15 mins" },
                      { value: "30 mins", label: "30 mins" },
                      { value: "45 mins", label: "45 mins" },
                      { value: "60 mins", label: "60 mins" },
                    ]}
                  />
                </Td>
              </TbodyTr>
            </tbody>
          </Table>
        </Form>
      </ContentBox0>
    );
  }
}
