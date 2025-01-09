import PropTypes from "prop-types";
import { SparklesIcon } from "@heroicons/react/24/solid";

import Btn from "../basic0/Btn";
import Icon from "../basic0/Icon";
import { HoverColor } from "./btnHelper";

export default function BtnClear({
  isPending = false,
  onClick = () => {},
  children = "BtnClear",
}) {
  return (
    <Btn
      type="reset"
      hoverColor={HoverColor.warn()}
      isPending={isPending}
      onClick={onClick}
    >
      <Icon>
        <SparklesIcon></SparklesIcon>
      </Icon>
      {children}
    </Btn>
  );
}

BtnClear.propTypes = {
  children: PropTypes.string,
  isPending: PropTypes.bool,
  onClick: PropTypes.func,
};
