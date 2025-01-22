import PropTypes from "prop-types";
export default function H1({ children }) {
  return (
    <h1 className="text-xl font-bold tracking-wide text-zinc-200">
      {children}
    </h1>
  );
}

H1.propTypes = {
  children: PropTypes.string,
};
