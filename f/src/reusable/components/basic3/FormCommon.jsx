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
      const fetchData = Object.keys(data.data).reduce((acc, key) => {
        if (key.includes("Select")) {
          acc[key] = setItem(data, key);
        } else if (key.includes("Date")) {
          acc[key] = setDate(data, key);
        } else {
          acc[key] = data.data[key];
        }
        return acc;
      }, {});
      console.log(fetchData);
      reset(fetchData);
    }
  }, [edit, data, reset]);

  async function onSubmit(data) {
    const trimmedData = trimStrings(data);

    const formData = Object.keys(trimmedData).reduce((acc, key) => {
      if (key.includes("Select")) {
        acc[key] = trimmedData[key].value;
      } else if (key.includes("Date")) {
        acc[key] = formatDate(trimmedData[key].startDate);
      } else {
        acc[key] = trimmedData[key];
      }
      return acc;
    }, {});

    console.log(formData);
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
            <Label htmlFor={item.field} key={i}>
              {StrPhrase.capEach1stLetter([item.field])}
              {item.type === "text" && (
                <InputForm
                  id={item.field}
                  type={item.type}
                  reg={register}
                  isRequired={{ required: item.isRequired }}
                  errors={errors}
                />
              )}
              {item.type === "select" && (
                <Selector
                  id={item.field}
                  Controller={Controller}
                  control={control}
                  errors={errors}
                  options={item.options.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  rules={item.rules}
                />
              )}
              {item.type === "date" && (
                <Date
                  id={item.field}
                  Controller={Controller}
                  control={control}
                  errors={errors}
                  rules={item.rules}
                />
              )}
              {item.type === "email" && (
                <InputForm
                  id={item.field}
                  type={item.type}
                  reg={register}
                  isRequired={{ required: item.isRequired }}
                  errors={errors}
                />
              )}
              {item.type === "file" && (
                <File
                  id={item.field}
                  reg={register}
                  isRequired={{ required: item.isRequired }}
                  getValues={getValues}
                  errors={errors}
                  specifyFile={item.specifyFile}
                />
              )}
            </Label>
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
