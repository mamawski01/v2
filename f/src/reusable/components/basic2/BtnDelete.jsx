import PropTypes from "prop-types";
import { TrashIcon } from "@heroicons/react/24/solid";
import Btn from "../basic0/Btn";
import Icon from "../basic0/Icon";
import { HoverColor } from "./btnHelper";

export default function BtnDelete({
  children = "BtnDelete",
  onClick = () => {},
  isPending = false,
}) {
  return (
    <Btn
      type="button"
      hoverColor={HoverColor.alert()}
      isPending={isPending}
      onClick={onClick}
    >
      <Icon>
        <TrashIcon></TrashIcon>
      </Icon>
      {children}
    </Btn>
  );
}

BtnDelete.propTypes = {
  children: PropTypes.string,
  isPending: PropTypes.bool,
  onClick: PropTypes.func,
};
