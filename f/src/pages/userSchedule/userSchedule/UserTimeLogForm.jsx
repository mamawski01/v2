import { useParams } from "react-router-dom";
import FormCommon from "../../../reusable/components/basic3/FormCommon";

export default function UserTimeLogForm() {
  return (
    <FormCommon
      title={"UserTime Log Form"}
      edit={false}
      fields={[
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
    >
      UserTimeLogForm
    </FormCommon>
  );
}
