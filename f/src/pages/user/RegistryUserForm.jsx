import { useParams } from "react-router-dom";
import {
  registryUserGetOne,
  registryUserPatchFile,
  registryUserPostFile,
} from "../../reusable/hooks/useHook1";
import {
  clearUser,
  onDeleteRegistryUser,
  resetDev,
  userDataType,
  userField,
} from "./helpers/userHelper";
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
      fields={userField(edit)}
      clear={clearUser}
      dataType={userDataType}
    ></FormCommon>
  );
}

["email", "text"];
