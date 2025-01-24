import { Controller, useForm, useWatch } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import {
  useFetch,
  useMutate,
  userEventGetOne,
  userEventPatchOne,
  userEventPostOne,
  userEventRemoveOne,
} from "../../../reusable/hooks/useHook1";
import { useEffect } from "react";
import { formatDate, formatDateComplete } from "../../../lib/utils0";
import {
  onError,
  onSubmitForm,
  trimStrings,
} from "../../../reusable/components/basic2/FormHelper";
import { patch, post, remove } from "../../../api/api";
import { swalAlert } from "../../../lib/utils1";
import ContentBox0 from "../../../reusable/components/basic0/ContentBox0";
import H1MainTitle from "../../../reusable/components/basic0/H1MainTitle";
import Form from "../../../reusable/components/basic2/Form";
import Row from "../../../reusable/components/basic0/Row";
import Label from "../../../reusable/components/basic0/Label";
import Selector from "../../../reusable/components/basic0/Selector";
import InputForm from "../../../reusable/components/basic1/InputForm";

export default function EventForm() {
  const { all, eId } = useParams();
  const forAll = Boolean(all);

  const location = useLocation();
  const eData = location?.state;
  console.log(eData);

  const {
    control,
    handleSubmit,
    formState,
    reset,
    getValues,
    register,
    setValue,
  } = useForm();

  const { errors } = formState;
  const { mutate, isPending } = useMutate();

  function superReset() {
    reset({ any: {} });
  }

  const edit = Boolean(eId);
  const { data: eventData } = useFetch(userEventGetOne + eId, edit, true);

  useEffect(() => {
    if (edit && eventData?.data) {
      const fetchData = {
        ...eventData.data,
        eventName: {
          value: eventData.data.eventName,
          label: eventData.data.eventName,
          eventType: eventData.data.eventType,
          penalty: eventData.data.penalty,
          benefitCost: eventData.data.benefitCost,
          reward: eventData.data.reward,
        },
      };
      console.log(fetchData);
      reset(fetchData);
    }
  }, [edit, eventData, reset]);

  const eventWatch = useWatch({ control, name: "eventName" });
  const penalty = edit
    ? getValues().eventName?.penalty
    : (eventWatch?.penalty ?? "");

  const benefitCost = edit
    ? getValues().eventName?.benefitCost
    : (eventWatch?.benefitCost ?? "");

  const reward = edit
    ? getValues().eventName?.reward
    : (eventWatch?.reward ?? "");

  reward && setValue("reward", reward);

  async function onSubmit(data) {
    const trimmedData = trimStrings(data);

    const eventName = getValues().eventName.value;

    const eventType = getValues().eventName.eventType;

    const formData = {
      ...trimmedData,
      date: formatDate(eData.eData.start),
      eventName: eventName.split(" (add event description)")[0],
      firstName: forAll ? "All users" : eData.data.firstName,
      eventType,
      dataId: forAll ? "0" : eData.data.dataId,
      penalty,
    };
    console.log(formData);
    mutate(
      edit
        ? patch(
            userEventPatchOne + formData._id,
            await onSubmitForm(formData, "text"),
          )
        : post(userEventPostOne, await onSubmitForm(formData, "text")),
    );
  }

  async function onDelete(id) {
    const confirmDelete = await swalAlert(
      `Yes, delete event for ${all ? `All users` : `${eData.data.firstName}`}`,
    );
    if (confirmDelete.isConfirmed) {
      mutate(remove(userEventRemoveOne + id));
    }
  }
  return (
    <ContentBox0>
      <H1MainTitle>Event Form</H1MainTitle>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        isPending={isPending}
        superReset={superReset}
        onDelete={() => onDelete(eData.data._id)}
        edit={edit}
        formName={
          all
            ? `${edit ? `Edit` : `Create`} Event for all Users`
            : `${edit ? `Edit` : `Create`} Event for ${eData.data.firstName}` +
              `, Event date: ${formatDateComplete(eData.start)}, dataId: ${eData.data.dataId}`
        }
      >
        <Row>
          <Label htmlFor="eventName">
            Event Name
            <Selector
              id="eventName"
              Controller={Controller}
              control={control}
              errors={errors}
              options={[
                {
                  value: "Day-Off (add event description)",
                  label: "Day-Off (add event description)",
                  eventType: "dayOff",
                },
                {
                  value: "Regular Event (add event description)",
                  label: "Regular Event (add event description)",
                  eventType: "regular",
                },
                {
                  value: "Special Event (add event description)",
                  label: "Special Event (add event description)",
                  eventType: "special",
                },
                {
                  value: "Optical Mission (add event description)",
                  label: "Optical Mission (add event description)",
                  eventType: "special",
                },
                {
                  value: "Sick Leave (add event description)",
                  label: "Sick Leave (add event description)",
                  eventType: "leave",
                },
                {
                  value: "Vacation Leave (add event description)",
                  label: "Vacation Leave (add event description)",
                  eventType: "leave",
                },
                {
                  value: "Neglect of Responsibilities (add event description)",
                  label: "Neglect of Responsibilities (add event description)",
                  eventType: "penalty",
                  penalty: "50",
                },
                {
                  value:
                    "Improper uniform and Unhygienic (add event description)",
                  label:
                    "Improper uniform and Unhygienic (add event description)",
                  eventType: "penalty",
                  penalty: "100",
                },
                {
                  value: "AWOL (add event description)",
                  label: "AWOL (add event description)",
                  eventType: "penalty",
                  penalty: "1000",
                },
                {
                  value: "Dental care (add event description)",
                  label: "Dental care (add event description)",
                  eventType: "benefits",
                  benefitCost: "1",
                },
                {
                  value: "Add Incentives (add event description)",
                  label: "Add Incentives (add event description)",
                  eventType: "reward",
                  reward: "1",
                },
                {
                  value: "Perfect Attendance (add event description)",
                  label: "Perfect Attendance (add event description)",
                  eventType: "reward",
                  reward: "1000",
                },
                {
                  value: "Proper uniform and hygiene (add event description)",
                  label: "Proper uniform and hygiene (add event description)",
                  eventType: "reward",
                  reward: "500",
                },
                {
                  value: "New Year’s Day",
                  label: "New Year’s Day",
                  eventType: "regular",
                },
                {
                  value: "Maundy Thursday",
                  label: "Maundy Thursday",
                  eventType: "regular",
                },
                {
                  value: "Good Friday",
                  label: "Good Friday",
                  eventType: "regular",
                },
                {
                  value: "Araw ng Kagitingan (Day of Valor)",
                  label: "Araw ng Kagitingan (Day of Valor)",
                  eventType: "regular",
                },
                {
                  value: "Labor Day",
                  label: "Labor Day",
                  eventType: "regular",
                },
                {
                  value: "Independence Day",
                  label: "Independence Day",
                  eventType: "regular",
                },
                {
                  value: "National Heroes Day",
                  label: "National Heroes Day",
                  eventType: "regular",
                },
                {
                  value: "Bonifacio Day",
                  label: "Bonifacio Day",
                  eventType: "regular",
                },
                {
                  value: "Christmas Day",
                  label: "Christmas Day",
                  eventType: "regular",
                },
                {
                  value: "Rizal Day",
                  label: "Rizal Day",
                  eventType: "regular",
                },
                {
                  value: "Chinese New Year",
                  label: "Chinese New Year",
                  eventType: "special",
                },
                {
                  value: "EDSA People Power Anniversary",
                  label: "EDSA People Power Anniversary",
                  eventType: "special",
                },
                {
                  value: "Black Saturday",
                  label: "Black Saturday",
                  eventType: "special",
                },
                {
                  value: "Ninoy Aquino Day",
                  label: "Ninoy Aquino Day",
                  eventType: "special",
                },
                {
                  value: "All Saints’ Day",
                  label: "All Saints’ Day",
                  eventType: "special",
                },
                {
                  value: "Feast of the Immaculate Conception",
                  label: "Feast of the Immaculate Conception",
                  eventType: "special",
                },
                {
                  value: "Last Day of the Year",
                  label: "Last Day of the Year",
                  eventType: "special",
                },
                {
                  value: "Bacolod City Charter Day",
                  label: "Bacolod City Charter Day",
                  eventType: "special",
                },
                {
                  value: "Eid al-Fitr (End of Ramadan)",
                  label: "Eid al-Fitr (End of Ramadan)",
                  eventType: "regular",
                },
                {
                  value: "Eid al-Adha (Feast of Sacrifice) ",
                  label: "Eid al-Adha (Feast of Sacrifice) ",
                  eventType: "regular",
                },
              ]}
            />
          </Label>
          <Label htmlFor="eventDescription">
            Event Description
            <InputForm
              id="eventDescription"
              reg={register}
              isRequired={{
                validate: (value) => {
                  if (
                    getValues().eventName?.value.includes(
                      "add event description",
                    ) &&
                    !value
                  ) {
                    return "add event description";
                  }
                },
              }}
              type="text"
              errors={errors}
            />
          </Label>
          {penalty && (
            <div className="animate-pulse text-red-600">Penalty: {penalty}</div>
          )}
          {benefitCost && (
            <Label htmlFor="benefitCost">
              Benefit Cost
              <InputForm
                id="benefitCost"
                reg={register}
                isRequired={{
                  validate: (value) => {
                    if (!value) {
                      return "add event Benefit Cost";
                    }
                    if (isNaN(value)) {
                      return "Please enter a valid number";
                    }
                    if (value > 2000) {
                      return "Allowed benefit is ₱2,000.00 only.";
                    }
                  },
                }}
                type="text"
                errors={errors}
              />
            </Label>
          )}
          {reward && (
            <Label htmlFor="reward">
              reward
              <InputForm
                id="reward"
                reg={register}
                isRequired={{
                  validate: (value) => {
                    if (!value) {
                      return "add event Benefit Cost";
                    }
                    if (isNaN(value)) {
                      return "Please enter a valid number";
                    }
                  },
                }}
                type="text"
                errors={errors}
              />
            </Label>
          )}
        </Row>
      </Form>
    </ContentBox0>
  );
}
