import { confirmedUserGetAll, useFetch } from "../../reusable/hooks/useHook1";
import { onDeleteConfirmedUser } from "./helpers/userHelper";
import UserListHelper from "./helpers/userListHelper";

export default function ConfirmedUserList() {
  const { data } = useFetch(confirmedUserGetAll);

  return (
    <UserListHelper
      data={data}
      title="Confirmed User List"
      onDelete={onDeleteConfirmedUser}
      to="confirmedUserForm/"
    ></UserListHelper>
  );
}
