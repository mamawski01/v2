import PropTypes from "prop-types";
import { ErrorIcon } from "react-hot-toast";

import Toast from "../basic0/Toast";
import Icon from "../basic0/Icon";

export default function ToastError({ children = "ToastError" }) {
  return (
    <Toast>
      <Icon>
        <ErrorIcon></ErrorIcon>
        <p>{children}</p>
      </Icon>
    </Toast>
  );
}

ToastError.propTypes = {
  children: PropTypes.node,
};
