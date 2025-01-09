import PropTypes from "prop-types";
import { HoverColor } from "../../../lib/utils0";
import Btn from "../componentsLvl1/Btn";
import Icon from "../componentsLvl1/Icon";
import { CursorArrowRippleIcon } from "@heroicons/react/24/solid";

export default function ClickBtn({
  children,
  icon = <CursorArrowRippleIcon></CursorArrowRippleIcon>,
  onClick,
}) {
  return (
    <Btn type="button" onClick={onClick} hoverColor={HoverColor.blue()}>
      <Icon>{icon}</Icon>
      {children}
    </Btn>
  );
}

ClickBtn.propTypes = {
  children: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
};
