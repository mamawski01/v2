import toast from "react-hot-toast";
import ToastError from "../../../reusable/components/basic1/ToastError";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  useMutate,
  userFinalTimelogPatchOne,
  userFinalTimelogRemoveOne,
} from "../../../reusable/hooks/useHook1";
import { useEffect } from "react";
import dayjs from "dayjs";
import {
  onSubmitForm,
  trimStrings,
} from "../../../reusable/components/basic2/FormHelper";
import { patch, remove } from "../../../api/api";
import { swalAlert } from "../../../lib/utils1";
import ContentBox0 from "../../../reusable/components/basic0/ContentBox0";
import H1MainTitle from "../../../reusable/components/basic0/H1MainTitle";
import Form from "../../../reusable/components/basic2/Form";
import Row from "../../../reusable/components/basic0/Row";
import Label from "../../../reusable/components/basic0/Label";
import Selector from "../../../reusable/components/basic0/Selector";
import { timeArr } from "../../../lib/utils0";

function onError() {
  return toast.custom(<ToastError>Missing Field(s).</ToastError>);
}

export default function UserFinalTimelogForm() {
  const navigate = useNavigate();

  const location = useLocation();
  const eData = location?.state;
  console.log(eData);
  const { control, handleSubmit, formState, reset, getValues } = useForm();

  const { errors } = formState;
  const { mutate, isPending } = useMutate();
  function superReset() {
    reset();
  }
  const edit = Boolean(eData._id);
  useEffect(() => {
    if (edit) {
      const fetchData = {
        ...eData,
        dateTime: {
          value: dayjs(eData.dateTime).format("hh:mm a"),
          label: dayjs(eData.dateTime).format("hh:mm a"),
        },
      };
      reset(fetchData);
    }
  }, [edit, reset, eData]);

  async function onSubmit(data) {
    const trimmedData = trimStrings(data);

    const timeInValues = getValues().dateTime.value;
    const formData = {
      ...trimmedData,
      dateTime: dayjs(`${eData.dateTime.split(" ")[0]} ${timeInValues}`).format(
        "YYYY-MM-DD HH:mm:ss",
      ),
    };
    mutate(
      patch(
        userFinalTimelogPatchOne + formData._id,
        await onSubmitForm(formData, "text"),
      ),
    );
    navigate(-1);
  }
  async function onDelete(id) {
    const confirmDelete = await swalAlert("Yes, delete Final Timelog");
    if (confirmDelete.isConfirmed) {
      mutate(remove(userFinalTimelogRemoveOne + id));
    }
  }
  return (
    <ContentBox0>
      <H1MainTitle>User Final Timelog Form</H1MainTitle>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        isPending={isPending}
        superReset={superReset}
        onDelete={() => onDelete(eData._id)}
        edit={edit}
        formName={`${eData.name}, ${dayjs(eData.dateTime).format("YYYY-MM-DD, dddd, hh:mm:ss a")}, dataId: ${eData.dataId}`}
      >
        <Row>
          <Label htmlFor="dateTime">
            DateTime
            <Selector
              id="dateTime"
              Controller={Controller}
              control={control}
              errors={errors}
              options={timeArr(false).map((time) => ({
                value: time,
                label: time,
              }))}
            />
          </Label>
        </Row>
      </Form>
    </ContentBox0>
  );
}
