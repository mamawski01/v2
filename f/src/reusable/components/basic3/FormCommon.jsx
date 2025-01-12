import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";

import { useFetch, useMutate } from "../../hooks/useHook1";
import {
  onError,
  OnSubmitForm,
  resetDate,
  setDate,
  setItem,
  trimStrings,
} from "../basic2/FormHelper";
import { useEffect } from "react";
import { formatDate, StrPhrase } from "../../../lib/utils0";
import { patch, post } from "../../../api/api";
import Loading from "../basic1/Loading";
import ContentBox0 from "../basic0/ContentBox0";
import H1MainTitle from "../basic0/H1MainTitle";
import Form from "../basic2/Form";
import Row from "../basic0/Row";
import Label from "../basic0/Label";
import InputForm from "../basic1/InputForm";
import Selector from "../basic0/Selector";
import Date from "../basic0/Date";
import File from "../basic0/File";

//   const { id } = useParams();
//   const edit = Boolean(id);

export default function FormCommon({
  title,
  getOne,
  patchFile,
  postFile = "",
  onDelete,
  id = "",
  edit = false,
  fields = [],
  devBtn,
}) {
  const { register, handleSubmit, formState, reset, control, getValues } =
    useForm();
  const { errors } = formState;
  const { mutate, isPending } = useMutate();
  function superReset() {
    reset({ birthdate: resetDate() });
  }

  const { data } = useFetch(getOne + id, edit, true);

  useEffect(() => {
    if (data && edit) {
      const fetchData = {
        ...data.data,
        status: setItem(data, "status"),
        gender: setItem(data, "gender"),
        birthdate: setDate(data, "birthdate"),
      };
      console.log(data.data);
      reset(fetchData);
    }
  }, [edit, data, reset]);

  async function onSubmit(data) {
    const trimmedData = trimStrings(data);

    const formData = {
      ...trimmedData,
      birthdate: formatDate(trimmedData.birthdate.startDate),
      gender: trimmedData.gender.value,
      status: trimmedData.gender.value,
    };
    mutate(
      edit
        ? patch(patchFile + id, await new OnSubmitForm(formData).file())
        : post(postFile, await new OnSubmitForm(formData).file()),
    );
  }

  if (!data && edit) return <Loading></Loading>;
  return (
    <ContentBox0>
      <H1MainTitle>{title}</H1MainTitle>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        isPending={isPending}
        superReset={superReset}
        onDelete={() => onDelete(id)}
        edit={edit}
        formName={edit ? `${data.data.firstName} ${data.data.lastName}` : ""}
      >
        <Row>
          {fields.slice().map((item, i) => (
            <div key={i}>
              {item.type === "text" && (
                <Label htmlFor={item.field}>
                  {StrPhrase.capEach1stLetter([item.field])}
                  <InputForm
                    id={item.field}
                    reg={register}
                    isRequired={{ required: item.isRequired }}
                    errors={errors}
                  />
                </Label>
              )}
            </div>
          ))}
        </Row>
        {devBtn && (
          <button type="button" onClick={() => reset(devBtn)}>
            Dev button
          </button>
        )}
      </Form>
    </ContentBox0>
  );
}

FormCommon.propTypes = {
  devBtn: PropTypes.object,
  edit: PropTypes.bool,
  fields: PropTypes.array,
  getOne: PropTypes.string,
  id: PropTypes.string,
  onDelete: PropTypes.func,
  patchFile: PropTypes.string,
  postFile: PropTypes.string,
  title: PropTypes.string,
};

//  <Label htmlFor="firstName">
//     first name
//     <InputForm
//       id="firstName"
//       reg={register}
//       isRequired={{ required: `firstName is required` }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="middleName">
//     middle name
//     <InputForm
//       id="middleName"
//       reg={register}
//       isRequired={{ required: `middleName is required` }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="lastName">
//     last name
//     <InputForm
//       id="lastName"
//       reg={register}
//       isRequired={{ required: `lastName is required` }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="gender">
//     gender
//     <Selector
//       id="gender"
//       Controller={Controller}
//       control={control}
//       errors={errors}
//       options={[
//         { value: "male", label: "male" },
//         { value: "female", label: "female" },
//       ]}
//       rules={{
//         validate: (value) => {
//           if (!value?.value && !value?.label) {
//             return `gender is required.`;
//           }
//           return true;
//         },
//       }}
//     />
//   </Label>
//   <Label htmlFor="status">
//     status
//     <Selector
//       id="status"
//       Controller={Controller}
//       control={control}
//       errors={errors}
//       options={[
//         { value: "single", label: "single" },
//         { value: "married", label: "married" },
//       ]}
//       rules={{
//         validate: (value) => {
//           if (!value?.value && !value?.label) {
//             return `status is required.`;
//           }
//           return true;
//         },
//       }}
//     />
//   </Label>
//   <Label htmlFor="birthdate">
//     birthdate
//     <Date
//       Controller={Controller}
//       control={control}
//       id="birthdate"
//       errors={errors}
//       rules={{
//         validate: (value) => {
//           if (!value?.startDate && !value?.endDate) {
//             return `birthdate is required.`;
//           }
//         },
//       }}
//     />
//   </Label>
//   <Label htmlFor="email">
//     email
//     <InputForm
//       id="email"
//       reg={register}
//       type="email"
//       isRequired={{ required: `email is required` }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="street">
//     street
//     <InputForm id="street" reg={register} errors={errors} />
//   </Label>
//   <Label htmlFor="purok">
//     purok
//     <InputForm id="purok" reg={register} errors={errors} />
//   </Label>
//   <Label htmlFor="brgy">
//     brgy
//     <InputForm
//       id="brgy"
//       reg={register}
//       isRequired={{ required: `brgy is required` }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="city">
//     city
//     <InputForm
//       id="city"
//       reg={register}
//       isRequired={{ required: `city is required` }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="province">
//     province
//     <InputForm
//       id="province"
//       reg={register}
//       isRequired={{ required: `province is required` }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="country">
//     country
//     <InputForm
//       id="country"
//       reg={register}
//       isRequired={{ required: `country is required` }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="contactNumber1">
//     contact number 1
//     <InputForm
//       id="contactNumber1"
//       reg={register}
//       isRequired={{ required: `contactNumber1 is required` }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="contactNumber2">
//     contact number 2
//     <InputForm id="contactNumber2" reg={register} errors={errors} />
//   </Label>
//   <Label htmlFor="contactNumber3">
//     contact number 3
//     <InputForm id="contactNumber3" reg={register} errors={errors} />
//   </Label>
//   <Label htmlFor="SSS">
//     SSS
//     <InputForm id="SSS" reg={register} errors={errors} />
//   </Label>
//   <Label htmlFor="PagIbig">
//     Pag-Ibig
//     <InputForm id="PagIbig" reg={register} errors={errors} />
//   </Label>
//   <Label htmlFor="PhilHealth">
//     PhilHealth
//     <InputForm id="PhilHealth" reg={register} errors={errors} />
//   </Label>
//   <Label htmlFor="TIN">
//     TIN
//     <InputForm id="TIN" reg={register} errors={errors} />
//   </Label>
//   <Label htmlFor="contactPersonNameInEmergency">
//     contact person name
//     <InputForm
//       id="contactPersonNameInEmergency"
//       reg={register}
//       isRequired={{
//         required: `contact person name is required`,
//       }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="contactPersonNumberInEmergency">
//     contact person number
//     <InputForm
//       id="contactPersonNumberInEmergency"
//       reg={register}
//       isRequired={{
//         required: `contact person number is required`,
//       }}
//       errors={errors}
//     />
//   </Label>
//   <Label htmlFor="file">
//     file
//     <File
//       id="file"
//       reg={register}
//       isRequired={{
//         required: edit ? false : `file is required`,
//       }}
//       getValues={getValues}
//       errors={errors}
//       specifyFile=".png,.jpg,.jpeg"
//     />
//   </Label>
