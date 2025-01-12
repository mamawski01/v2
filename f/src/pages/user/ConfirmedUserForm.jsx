import {
  confirmedUserGetOne,
  confirmedUserPatchFile,
} from "../../reusable/hooks/useHook1";
import UserForm from "./helpers/UserForm";
import { onDeleteConfirmedUser } from "./helpers/userHelper";

export default function ConfirmedUserForm() {
  return (
    <UserForm
      title={"Confirmed User Form"}
      getOne={confirmedUserGetOne}
      patchFile={confirmedUserPatchFile}
      onDelete={onDeleteConfirmedUser}
    ></UserForm>
  );
}
