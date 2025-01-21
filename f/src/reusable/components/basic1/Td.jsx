import PropTypes from "prop-types";
export default function Td({ children = "Td" }) {
  return <td className="p-4">{children}</td>;
}

Td.propTypes = {
  children: PropTypes.node,
};
