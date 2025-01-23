import FormCommon from "../../../reusable/components/basic3/FormCommon";
import {
  userTimelogGetOne,
  userTimelogPostUnique,
} from "../../../reusable/hooks/useHook1";

export default function UserTimeLogForm() {
  return (
    <FormCommon
      title={"UserTime Log Form"}
      edit={false}
      getOne={userTimelogGetOne}
      postOne={userTimelogPostUnique}
      fields={[
        {
          field: "file",
          type: "file",
          isRequired: `file is required`,
          specifyFile: ".txt",
        },
      ]}
      dataType="timelog"
    >
      UserTimeLogForm
    </FormCommon>
  );
}
