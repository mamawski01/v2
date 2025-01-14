import { useParams } from "react-router-dom";
import FormCommon from "../../reusable/components/basic3/FormCommon";
import {
  confirmedUserGetOne,
  confirmedUserPatchFile,
} from "../../reusable/hooks/useHook1";

export default function ManageUserForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  return (
    <FormCommon
      title={"Manage User Form"}
      getOne={confirmedUserGetOne}
      patchFile={confirmedUserPatchFile}
      id={id}
      edit={edit}
      fields={[
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
      ]}
    >
      ManageUserForm
    </FormCommon>
  );
}
