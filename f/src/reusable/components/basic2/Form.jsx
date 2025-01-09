import PropTypes from "prop-types";

import { useEffect } from "react";
import ContentBox1 from "../basic0/ContentBox1";
import BtnGoBack from "./BtnGoBack";
import BtnEdit from "./BtnEdit";
import BtnSave from "./BtnSave";
import BtnClear from "./BtnClear";
import BtnDelete from "./BtnDelete";

export default function Form({
  children = "Form",
  onSubmit = () => {},
  isPending = false,
  superReset = () => {},
  edit = false,
  onDelete,
  formName = "Form Name",
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <ContentBox1>
      <div className="flex w-full justify-end">
        <div>
          <BtnGoBack></BtnGoBack>
        </div>
      </div>
      <form
        autoComplete="off"
        onSubmit={onSubmit}
        encType="multipart/form-data"
        className="flex w-full flex-1 flex-col gap-2"
      >
        {formName}
        {children}
        <div className="flex w-full justify-evenly">
          {edit ? (
            <div>
              <BtnEdit isPending={isPending}></BtnEdit>
            </div>
          ) : (
            <div>
              <BtnSave isPending={isPending}>Save</BtnSave>
            </div>
          )}
          <div>
            <BtnClear isPending={isPending} onClick={superReset}></BtnClear>
          </div>
          {edit && onDelete && (
            <div>
              <BtnDelete onClick={onDelete}>Delete</BtnDelete>
            </div>
          )}
          <div>
            <BtnGoBack></BtnGoBack>
          </div>
        </div>
      </form>
    </ContentBox1>
  );
}

Form.propTypes = {
  children: PropTypes.node,
  edit: PropTypes.bool,
  formName: PropTypes.string,
  isPending: PropTypes.bool,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func,
  superReset: PropTypes.func,
};
