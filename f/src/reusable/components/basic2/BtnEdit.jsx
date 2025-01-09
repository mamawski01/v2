import PropTypes from "prop-types";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

import Btn from "../basic0/Btn";
import { HoverColor } from "./btnHelper";
import Icon from "../basic0/Icon";
export default function BtnEdit({
  isPending = false,
  children = "Edit",
  onClick = () => {},
}) {
  return (
    <Btn
      type="submit"
      isPending={isPending}
      hoverColor={HoverColor.warn()}
      onClick={onClick}
    >
      <Icon>
        <WrenchScrewdriverIcon></WrenchScrewdriverIcon>
      </Icon>
      {children}
    </Btn>
  );
}

BtnEdit.propTypes = {
  children: PropTypes.string,
  isPending: PropTypes.bool,
  onClick: PropTypes.func,
};
