import PropTypes from "prop-types";

export default function H1mdAndUp({ children = "H1mdAndUp" }) {
  return (
    <h1 className="hidden md:inline-block" title={children}>
      {children}
    </h1>
  );
}

H1mdAndUp.propTypes = {
  children: PropTypes.node,
};
