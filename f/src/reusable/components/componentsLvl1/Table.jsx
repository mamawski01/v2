import PropTypes from "prop-types";

export default function Table({ children = "Table" }) {
  return <table className="w-full flex-1 text-start">{children}</table>;
}

Table.propTypes = {
  children: PropTypes.node,
};
