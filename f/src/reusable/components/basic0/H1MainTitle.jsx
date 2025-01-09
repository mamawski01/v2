import PropTypes from "prop-types";
export default function H1MainTitle({ children = "H1MainTitle" }) {
  return (
    <h1 className="w-full border-b border-gray-300/20 p-2 pt-0 text-center text-xl font-bold tracking-wide text-zinc-200">
      {children}
    </h1>
  );
}

H1MainTitle.propTypes = {
  children: PropTypes.node,
};
