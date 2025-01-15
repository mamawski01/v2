import { login } from "../../api/api";
import FormCommon from "../../reusable/components/basic3/FormCommon";
import { dummyUrl } from "../../reusable/hooks/useHook1";

export default function Login() {
  return (
    <FormCommon
      title={"Login"}
      getOne={dummyUrl}
      fields={[
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
      login={login}
    ></FormCommon>
  );
}
