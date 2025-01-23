import { useParams } from "react-router-dom";
import FormCommon from "../../reusable/components/basic3/FormCommon";
import {
  confirmedUserGetOne,
  confirmedUserPatchFile,
} from "../../reusable/hooks/useHook1";
import {
  clearUser,
  onDeleteConfirmedUser,
  resetDev,
  userDataType,
  userField,
} from "./helpers/userHelper";

export default function ConfirmedUserForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  return (
    <FormCommon
      title={"Confirmed User Form"}
      getOne={confirmedUserGetOne}
      patchOne={confirmedUserPatchFile}
      onDelete={onDeleteConfirmedUser}
      id={id}
      edit={edit}
      devBtn={resetDev}
      fields={[
        ...userField(edit),
        {
          field: "roleSelect",
          type: "select",
          options: ["admin", "manager", "user"],
          rules: {
            validate: (value) => {
              if (!value?.value && !value?.label) {
                return `genderSelect is required.`;
              }
              return true;
            },
          },
        },
        {
          field: "dataId",
          type: "text",
          isRequired: `dataId is required`,
        },
        {
          field: "username",
          type: "text",
          isRequired: `username is required`,
        },
        {
          field: "password",
          type: "password",
          isRequired: `password is required`,
        },
        {
          field: "confirmPassword",
          type: "password",
          isRequired: `passwordConfirm is required`,
        },
      ]}
      clear={clearUser}
      dataType={userDataType}
    ></FormCommon>
  );
}
