import PropTypes from "prop-types";
export default function Thead({ children = "Thead" }) {
  return <thead className="w-full">{children}</thead>;
}

Thead.propTypes = {
  children: PropTypes.node,
};
