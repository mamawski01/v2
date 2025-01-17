import { login } from "../../api/api";
import { useGlobal } from "../../context/globalHook";
import Logo from "../../reusable/components/basic1/Logo";
import FormCommon from "../../reusable/components/basic3/FormCommon";
import { dummyUrl } from "../../reusable/hooks/useHook1";

export default function Login() {
  const { userSet } = useGlobal();
  return (
    <div className="mx-auto flex h-screen w-fit items-center">
      <div className="rounded border border-gray-300/20 p-5 px-8">
        <Logo></Logo>
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
              isRequired: `confirmPassword is required`,
            },
          ]}
          loginObj={{ login, userSet }}
        ></FormCommon>
      </div>
    </div>
  );
}
