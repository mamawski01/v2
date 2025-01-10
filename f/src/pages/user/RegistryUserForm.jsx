import { useForm, Controller } from "react-hook-form";
import { useFetch, useMutate } from "../../reusable/hooks/useHook1";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import {
  onError,
  OnSubmitForm,
  resetDate,
  setDate,
  setItem,
  trimStrings,
} from "../../reusable/components/basic2/FormHelper";
import { patch, post, remove } from "../../api/api";
import { swalAlert } from "../../lib/utils1";
import Loading from "../../reusable/components/basic1/Loading";
import ContentBox0 from "../../reusable/components/basic0/ContentBox0";
import H1MainTitle from "../../reusable/components/basic0/H1MainTitle";
import Form from "../../reusable/components/basic2/Form";
import Row from "../../reusable/components/basic0/Row";
import Label from "../../reusable/components/basic0/Label";
import InputForm from "../../reusable/components/basic1/InputForm";
import Selector from "../../reusable/components/basic0/Selector";
import Date from "../../reusable/components/basic0/Date";
import File from "../../reusable/components/basic0/File";
import dayjs from "dayjs";
import { formatDate } from "../../lib/utils0";

export default function RegistryUserForm() {
  const { register, handleSubmit, formState, reset, control, getValues } =
    useForm();
  const { errors } = formState;
  const { mutate, isPending } = useMutate();

  function superReset() {
    reset({ birthdate: resetDate() });
  }
  const { id } = useParams();
  const edit = Boolean(id);

  const { data } = useFetch(`/registryUserBEGetOne/${id}`, edit, true);

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
      employmentDate: formatDate(trimmedData.employmentDate.startDate),
      gender: trimmedData.gender.value,
      status: trimmedData.gender.value,
    };
    mutate(
      edit
        ? patch(
            `/registryUserBEPatchFile/${formData._id}`,
            await new OnSubmitForm(formData).file(),
          )
        : post(
            "/registryUserBEPostFile",
            await new OnSubmitForm(formData).file(),
          ),
    );
  }

  async function onDelete(id) {
    const confirmDelete = await swalAlert("Yes, registry User");
    if (confirmDelete.isConfirmed) {
      mutate(remove(`/registryUserBEDeleteOne/${id}`));
    }
  }

  if (!data && edit) return <Loading></Loading>;
  return (
    <ContentBox0>
      <H1MainTitle>Registry User Form</H1MainTitle>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        isPending={isPending}
        superReset={superReset}
        onClick={() => onDelete(id)}
        edit={edit}
        formName={edit ? `${data.data.firstName} ${data.data.lastName}` : ""}
      >
        <Row>
          <Label htmlFor="firstName">
            first name
            <InputForm
              id="firstName"
              reg={register}
              isRequired={{ required: `firstName is required` }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="middleName">
            middle name
            <InputForm
              id="middleName"
              reg={register}
              isRequired={{ required: `middleName is required` }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="lastName">
            last name
            <InputForm
              id="lastName"
              reg={register}
              isRequired={{ required: `lastName is required` }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="gender">
            gender
            <Selector
              id="gender"
              Controller={Controller}
              control={control}
              errors={errors}
              options={[
                { value: "male", label: "male" },
                { value: "female", label: "female" },
              ]}
            />
          </Label>
          <Label htmlFor="status">
            status
            <Selector
              id="status"
              Controller={Controller}
              control={control}
              errors={errors}
              options={[
                { value: "single", label: "single" },
                { value: "married", label: "married" },
              ]}
            />
          </Label>
          <Label htmlFor="birthdate">
            birthdate
            <Date
              Controller={Controller}
              control={control}
              id="birthdate"
              errors={errors}
            />
          </Label>
          <Label htmlFor="email">
            email
            <InputForm
              id="email"
              reg={register}
              type="email"
              isRequired={{ required: `email is required` }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="street">
            street
            <InputForm id="street" reg={register} errors={errors} />
          </Label>
          <Label htmlFor="purok">
            purok
            <InputForm id="purok" reg={register} errors={errors} />
          </Label>
          <Label htmlFor="brgy">
            brgy
            <InputForm
              id="brgy"
              reg={register}
              isRequired={{ required: `brgy is required` }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="city">
            city
            <InputForm
              id="city"
              reg={register}
              isRequired={{ required: `city is required` }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="province">
            province
            <InputForm
              id="province"
              reg={register}
              isRequired={{ required: `province is required` }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="country">
            country
            <InputForm
              id="country"
              reg={register}
              isRequired={{ required: `country is required` }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="contactNumber1">
            contact number 1
            <InputForm
              id="contactNumber1"
              reg={register}
              isRequired={{ required: `contactNumber1 is required` }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="contactNumber2">
            contact number 2
            <InputForm id="contactNumber2" reg={register} errors={errors} />
          </Label>{" "}
          <Label htmlFor="contactNumber3">
            contact number 3
            <InputForm id="contactNumber3" reg={register} errors={errors} />
          </Label>
          <Label htmlFor="SSS">
            SSS
            <InputForm id="SSS" reg={register} errors={errors} />
          </Label>
          <Label htmlFor="PagIbig">
            Pag-Ibig
            <InputForm id="PagIbig" reg={register} errors={errors} />
          </Label>
          <Label htmlFor="PhilHealth">
            PhilHealth
            <InputForm id="PhilHealth" reg={register} errors={errors} />
          </Label>
          <Label htmlFor="TIN">
            TIN
            <InputForm id="TIN" reg={register} errors={errors} />
          </Label>
          <Label htmlFor="contactPersonNameInEmergency">
            contact person name
            <InputForm
              id="contactPersonNameInEmergency"
              reg={register}
              isRequired={{
                required: `contact person name is required`,
              }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="contactPersonNumberInEmergency">
            contact person number
            <InputForm
              id="contactPersonNumberInEmergency"
              reg={register}
              isRequired={{
                required: `contact person number is required`,
              }}
              errors={errors}
            />
          </Label>
          <Label htmlFor="file">
            file
            <File
              id="file"
              reg={register}
              isRequired={{
                required: edit ? false : `file is required`,
              }}
              getValues={getValues}
              errors={errors}
              specifyFile=".png,.jpg,.jpeg"
            />
          </Label>
        </Row>
        <button type="button" onClick={() => reset(resetDev())}>
          Dev button
        </button>
      </Form>
    </ContentBox0>
  );
}

function resetDev() {
  return {
    firstName: "John",
    middleName: "Doe",
    lastName: "Smith",
    gender: { value: "female", label: "female" },
    status: { value: "married", label: "married" },
    birthdate: {
      startDate: dayjs().$d,
      endDate: dayjs().$d,
    },
    employmentDate: {
      startDate: dayjs().$d,
      endDate: dayjs().$d,
    },
    email: "johndoe@example.com",
    street: "123 Main St",
    purok: "Purok 1",
    brgy: "Barangay 1",
    city: "Manila",
    province: "Metro Manila",
    country: "Philippines",
    contactNumber1: "09123456789",
    contactNumber2: "09234567890",
    contactNumber3: "09345678901",
    SSS: "1234567890",
    PagIbig: "0987654321",
    PhilHealth: "1234567890",
    TIN: "1234567890",
    contactPersonNameInEmergency: "Jane Doe",
    contactPersonNumberInEmergency: "09123456789",
    file: "https://example.com/image.jpg",
  };
}
