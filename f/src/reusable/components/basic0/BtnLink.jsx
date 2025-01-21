import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function BtnLink({
  children = <p>BtnLink</p>,
  to = "/",
  hoverColor = "hover:bg-teal-900/20 backdrop-blur-sm",
  state,
}) {
  return (
    <Link
      to={to}
      state={state}
      preventScrollReset={true}
      className={`${hoverColor} flex w-full items-center justify-between rounded p-1 transition-all duration-300`}
    >
      {children}
    </Link>
  );
}

BtnLink.propTypes = {
  children: PropTypes.node,
  hoverColor: PropTypes.string,
  state: PropTypes.object,
  to: PropTypes.string,
};
