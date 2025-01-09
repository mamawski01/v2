import PropTypes from "prop-types";

import { HoverColor } from "../../../lib/utils0";
import Btn from "../componentsLvl1/Btn";
import Icon from "../componentsLvl1/Icon";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export default function AddBtnLink({ children = "AddBtn", to = "/" }) {
  return (
    <Btn link={true} to={to} hoverColor={HoverColor.save()}>
      <Icon>
        <PlusCircleIcon></PlusCircleIcon>
      </Icon>
      {children}
    </Btn>
  );
}

AddBtnLink.propTypes = {
  children: PropTypes.string,
  to: PropTypes.string,
};
