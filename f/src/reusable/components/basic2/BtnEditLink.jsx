import PropTypes from "prop-types";
import { WrenchIcon } from "@heroicons/react/24/solid";
import Icon from "../basic0/Icon";
import { HoverColor } from "./btnHelper";
import BtnLink from "../basic0/BtnLink";

export default function BtnEditLink({ children = "EditBtnLink", to = "/" }) {
  return (
    <div>
      <BtnLink link={true} to={to} hoverColor={HoverColor.warn()}>
        <Icon>
          <WrenchIcon></WrenchIcon>
        </Icon>
        {children}
      </BtnLink>
    </div>
  );
}

BtnEditLink.propTypes = {
  children: PropTypes.string,
  to: PropTypes.string,
};
