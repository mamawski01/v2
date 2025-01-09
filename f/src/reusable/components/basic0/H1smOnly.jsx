import PropTypes from "prop-types";

export default function H1smOnly({ children = "H1smOnly" }) {
  return (
    <h1 className="hidden sm:inline-block md:hidden" title={children}>
      {children}
    </h1>
  );
}

H1smOnly.propTypes = {
  children: PropTypes.node,
};
