import {
  registryUserGetAll,
  registryUserToConfirmedUserTransferOne,
  useFetch,
} from "../../reusable/hooks/useHook1";
import { swalAlert } from "../../lib/utils1";
import { post } from "../../api/api";
import UserListHelper from "./helpers/userListHelper";
import { onDeleteRegistryUser } from "./helpers/userHelper";

export default function RegistryUserList() {
  const { data } = useFetch(registryUserGetAll);

  async function onTransfer(mutate, id) {
    const confirmDelete = await swalAlert(
      "Yes, transfer registry user to confirm User",
    );
    if (confirmDelete.isConfirmed) {
      mutate(post(registryUserToConfirmedUserTransferOne + id));
    }
  }
  return (
    <UserListHelper
      data={data}
      onTransfer={onTransfer}
      title="Registry User List"
      onDelete={onDeleteRegistryUser}
      to="registryUserForm/"
    ></UserListHelper>
  );
}
