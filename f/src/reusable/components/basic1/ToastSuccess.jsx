import PropTypes from "prop-types";

import Toast from "../basic0/Toast";
import { CheckmarkIcon } from "react-hot-toast";
import Icon from "../basic0/Icon";

export default function ToastSuccess({ children }) {
  return (
    <Toast>
      <Icon>
        <CheckmarkIcon></CheckmarkIcon>
        <p>{children}</p>
      </Icon>
    </Toast>
  );
}

ToastSuccess.propTypes = {
  children: PropTypes.node,
};
