import PropTypes from "prop-types";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import Btn from "../basic0/Btn";
import Icon from "../basic0/Icon";
import { HoverColor } from "./btnHelper";

export default function BtnSave({
  children = "SaveBtn",
  isPending = false,
  onClick = () => {},
}) {
  return (
    <div>
      <Btn
        type="submit"
        isPending={isPending}
        hoverColor={HoverColor.save()}
        onClick={onClick}
      >
        <Icon>
          <DocumentPlusIcon></DocumentPlusIcon>
        </Icon>
        {children}
      </Btn>
    </div>
  );
}

BtnSave.propTypes = {
  children: PropTypes.string,
  isPending: PropTypes.bool,
  onClick: PropTypes.func,
};
