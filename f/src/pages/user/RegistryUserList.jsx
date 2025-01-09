import BtnLink from "../../reusable/components/basic0/BtnLink";
import ContentBox0 from "../../reusable/components/basic0/ContentBox0";
import H1MainTitle from "../../reusable/components/basic0/H1MainTitle";
import CreateSomething from "../../reusable/components/basic1/CreateSomething";
import Loading from "../../reusable/components/basic1/Loading";
import { useFetch } from "../../reusable/hooks/useHook1";

export default function RegistryUserList() {
  const { data } = useFetch("/registryUserBEGetAll");
  const registerUsers = data?.data?.reverse();
  if (!registerUsers) return <Loading></Loading>;
  if (registerUsers) {
    return (
      <ContentBox0>
        <H1MainTitle>RegistryUserList</H1MainTitle>
        {registerUsers.length === 0 && (
          <CreateSomething>
            <p>List is empty, create something...</p>
            <div>
              <BtnLink to="registryUserForm">Add User</BtnLink>
            </div>
          </CreateSomething>
        )}
      </ContentBox0>
    );
  }
}
