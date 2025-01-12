import { useParams } from "react-router-dom";
import {
  registryUserGetOne,
  registryUserPatchFile,
  registryUserPostFile,
} from "../../reusable/hooks/useHook1";
import { onDeleteRegistryUser, resetDev } from "./helpers/userHelper";
import FormCommon from "../../reusable/components/basic3/FormCommon";

export default function RegistryUserForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  return (
    <FormCommon
      title={"Registry User Form"}
      getOne={registryUserGetOne}
      patchFile={registryUserPatchFile}
      postFile={registryUserPostFile}
      onDelete={onDeleteRegistryUser}
      id={id}
      edit={edit}
      devBtn={resetDev}
      fields={[
        {
          field: "firstName",
          type: "text",
          isRequired: `firstName is required`,
        },
        {
          field: "middleName",
          type: "text",
          isRequired: `middleName is required`,
        },
        { field: "lastName", type: "text", isRequired: `lastName is required` },
        {
          field: "gender",
          type: "select",
          options: ["male", "female"],
          rules: {
            validate: (value) => {
              if (!value?.value && !value?.label) {
                return `gender is required.`;
              }
              return true;
            },
          },
        },
        {
          field: "status",
          type: "select",
          options: ["single", "married"],
          rules: {
            validate: (value) => {
              if (!value?.value && !value?.label) {
                return `status is required.`;
              }
              return true;
            },
          },
        },
        {
          field: "birthdate",
          type: "date",
          rules: {
            validate: (value) => {
              if (!value?.startDate && !value?.endDate) {
                return `birthdate is required.`;
              }
            },
          },
        },
        { field: "email", type: "email", isRequired: `email is required` },
        { field: "street", type: "text", isRequired: false },
        { field: "purok", type: "text", isRequired: false },
        { field: "brgy", type: "text", isRequired: `brgy is required` },
        { field: "city", type: "text", isRequired: `city is required` },
        { field: "province", type: "text", isRequired: `province is required` },
        { field: "country", type: "text", isRequired: `country is required` },
        {
          field: "contactNumber1",
          type: "text",
          isRequired: `contactNumber1 is required`,
        },
        { field: "contactNumber2", type: "text", isRequired: false },
        { field: "contactNumber3", type: "text", isRequired: false },
        { field: "SSS", type: "text", isRequired: false },
        { field: "PagIbig", type: "text", isRequired: false },
        { field: "PhilHealth", type: "text", isRequired: false },
        { field: "TIN", type: "text", isRequired: false },
        {
          field: "contactPersonNameInEmergency",
          type: "text",
          isRequired: `contact person name is required`,
        },
        {
          field: "contactPersonNumberInEmergency",
          type: "text",
          isRequired: `contact person number is required`,
        },
        {
          field: "file",
          type: "file",
          isRequired: edit ? false : `file is required`,
          specifyFile: ".png,.jpg,.jpeg",
        },
      ]}
    ></FormCommon>
  );
}

["email", "text"];
