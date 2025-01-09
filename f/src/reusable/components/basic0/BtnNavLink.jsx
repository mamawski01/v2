import PropTypes from "prop-types";

import { NavLink } from "react-router-dom";

export default function BtnNavLink({
  children = <p>BtnNavLink</p>,
  to = "/",
  hoverColor = "hover:bg-purple-900/20 backdrop-blur-sm",
}) {
  const style = `${hoverColor} flex w-full items-center justify-between rounded p-1 transition-all duration-300`;
  return (
    <NavLink
      to={to}
      preventScrollReset={true}
      className={({ isActive }) =>
        isActive ? `font-bold text-zinc-200 underline ${style}` : style
      }
    >
      {children}
    </NavLink>
  );
}

BtnNavLink.propTypes = {
  children: PropTypes.node,
  hoverColor: PropTypes.string,
  to: PropTypes.string,
};
