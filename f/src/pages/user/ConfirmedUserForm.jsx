import { useParams } from "react-router-dom";
import FormCommon from "../../reusable/components/basic3/FormCommon";
import {
  confirmedUserGetOne,
  confirmedUserPatchFile,
} from "../../reusable/hooks/useHook1";
import {
  onDeleteConfirmedUser,
  resetDev,
  userField,
} from "./helpers/userHelper";

export default function ConfirmedUserForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  return (
    <FormCommon
      title={"Confirmed User Form"}
      getOne={confirmedUserGetOne}
      patchFile={confirmedUserPatchFile}
      onDelete={onDeleteConfirmedUser}
      id={id}
      edit={edit}
      devBtn={resetDev}
      fields={userField(edit)}
    ></FormCommon>
  );
}
