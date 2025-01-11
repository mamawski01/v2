import PropTypes from "prop-types";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import Icon from "../basic0/Icon";
import { HoverColor } from "./btnHelper";
import BtnLink from "../basic0/BtnLink";

export default function BtnAddInLink({ children = "AddBtn", to = "/" }) {
  return (
    <div>
      <BtnLink link={true} to={to} hoverColor={HoverColor.save()}>
        <Icon>
          <PlusCircleIcon></PlusCircleIcon>
        </Icon>
        {children}
      </BtnLink>
    </div>
  );
}

BtnAddInLink.propTypes = {
  children: PropTypes.string,
  to: PropTypes.string,
};
