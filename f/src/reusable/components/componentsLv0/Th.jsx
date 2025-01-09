import PropTypes from "prop-types";
export default function Th({ children = "Th" }) {
  return <th className="p-4 text-start">{children}</th>;
}

Th.propTypes = {
  children: PropTypes.string,
};
