import PropTypes from "prop-types";

export default function Main({ children }) {
  return <main className="relative flex w-full flex-col p-5">{children}</main>;
}

Main.propTypes = {
  children: PropTypes.any,
};
