import toast from "react-hot-toast";

import { useLocation, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import dayjs from "dayjs";
import {
  onSubmitForm,
  trimStrings,
} from "../../../reusable/components/basic2/FormHelper";
import { patch, post } from "../../../api/api";
import {
  useMutate,
  userWagePatchOne,
  userWagePostOne,
} from "../../../reusable/hooks/useHook1";
import ContentBox0 from "../../../reusable/components/basic0/ContentBox0";
import H1MainTitle from "../../../reusable/components/basic0/H1MainTitle";
import Form from "../../../reusable/components/basic2/Form";
import Row from "../../../reusable/components/basic0/Row";
import Label from "../../../reusable/components/basic0/Label";
import Date from "../../../reusable/components/basic0/Date";
import Selector from "../../../reusable/components/basic0/Selector";
import InputForm from "../../../reusable/components/basic1/InputForm";
import ToastError from "../../../reusable/components/basic1/ToastError";

function onError() {
  return toast.custom(<ToastError>Missing Field(s).</ToastError>);
}

export default function UserWageForm() {
  const { wId } = useParams();
  const edit = Boolean(wId);

  const location = useLocation();
  const eData = location?.state;

  const { control, handleSubmit, formState, reset, getValues, register } =
    useForm();
  const { errors } = formState;
  const { mutate, isPending } = useMutate();

  function superReset() {
    reset({
      dateHired: { startDate: null, endDate: null },
      employmentType: {},
      position: {},
    });
  }

  useEffect(() => {
    if (edit) {
      const fetchData = {
        ...eData.w,
        employmentType: {
          value: eData.w.employmentType,
          label: eData.w.employmentType,
        },
        position: {
          value: eData.w.position,
          label: eData.w.position,
        },
        dateHired: {
          startDate: dayjs(eData.w.dateHired).$d,
          endDate: dayjs(eData.w.dateHired).$d,
        },
      };
      reset(fetchData);
    }
  }, [edit, eData, reset]);

  async function onSubmit(data) {
    const trimmedData = trimStrings(data);

    const employmentType = getValues().employmentType.value;

    const position = getValues().position.value;

    const dateHired = dayjs(getValues().dateHired.startDate).format(
      "YYYY-MM-DD",
    );

    const formData = {
      ...trimmedData,
      employmentType,
      position,
      dateHired,
      firstName: eData.us.firstName,
      dataId: eData.us.dataId,
    };
    console.log(formData);
    mutate(
      edit
        ? patch(
            userWagePatchOne + formData._id,
            await onSubmitForm(formData, "text"),
          )
        : post(userWagePostOne, await onSubmitForm(formData, "text")),
    );
  }

  return (
    <ContentBox0>
      <H1MainTitle>Wage Form</H1MainTitle>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        isPending={isPending}
        superReset={superReset}
        edit={edit}
        formName={`${eData.us.firstName}, dataId: ${eData.us.dataId}`}
      >
        <Row>
          <Label htmlFor="dateHired">
            Date Hired
            <Date
              Controller={Controller}
              control={control}
              id="dateHired"
              errors={errors}
            />
          </Label>
          <Label htmlFor="employmentType">
            Employment Type
            <Selector
              id="employmentType"
              Controller={Controller}
              control={control}
              errors={errors}
              options={[
                {
                  value: "probationary",
                  label: "probationary",
                },
                {
                  value: "regular",
                  label: "regular",
                },
              ]}
            />
          </Label>
          <Label htmlFor="position">
            Position
            <Selector
              id="position"
              Controller={Controller}
              control={control}
              errors={errors}
              options={[
                {
                  value: "sales",
                  label: "sales",
                },
                {
                  value: "cashier",
                  label: "cashier",
                },
                {
                  value: "optician",
                  label: "optician",
                },
                {
                  value: "optometrist",
                  label: "optometrist",
                },
              ]}
            />
          </Label>
          <Label htmlFor="wage">
            Wage
            <InputForm
              id="wage"
              reg={register}
              isRequired={{
                validate: (value) => {
                  if (!value) {
                    return "fill up wage";
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
          <Label htmlFor="sssAllowance">
            SSS Allowance
            <InputForm
              id="sssAllowance"
              reg={register}
              isRequired={{
                validate: (value) => {
                  if (!value) {
                    return "fill up sssAllowance";
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
          <Label htmlFor="allowance">
            Allowance
            <InputForm
              id="allowance"
              reg={register}
              isRequired={{
                validate: (value) => {
                  if (!value) {
                    return "fill up allowance";
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
        </Row>
      </Form>
    </ContentBox0>
  );
}
