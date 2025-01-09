import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/solid";

import Btn from "../basic0/Btn";
import { HoverColor } from "./btnHelper";
import Icon from "../basic0/Icon";

export default function BtnGoBack({ children = "Go Back" }) {
  const navigate = useNavigate();
  return (
    <Btn hoverColor={HoverColor.alert()} onClick={() => navigate(-1)}>
      <Icon>
        <ChevronDoubleLeftIcon></ChevronDoubleLeftIcon>
      </Icon>
      {children}
    </Btn>
  );
}

BtnGoBack.propTypes = {
  children: PropTypes.string,
};
