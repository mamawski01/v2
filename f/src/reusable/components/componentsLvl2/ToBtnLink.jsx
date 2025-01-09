import PropTypes from "prop-types";
import Btn from "../componentsLvl1/Btn";
import Icon from "../componentsLvl1/Icon";
import { HoverColor } from "../../../lib/utils0";
import { LinkIcon } from "@heroicons/react/24/solid";

export default function ToBtnLink({
  children = "ToBtnLink",
  to = "/",
  icon = <LinkIcon></LinkIcon>,
  state = {},
}) {
  return (
    <Btn link={true} state={state} to={to} hoverColor={HoverColor.to()}>
      <Icon>{icon}</Icon>
      {children}
    </Btn>
  );
}

ToBtnLink.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  state: PropTypes.object,
  to: PropTypes.string,
};
