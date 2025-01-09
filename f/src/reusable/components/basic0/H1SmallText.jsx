import PropTypes from "prop-types";

export default function H1SmallText({ children = "H1small" }) {
  return (
    <h1 className="text-xs text-zinc-400" title={children}>
      {children}
    </h1>
  );
}

H1SmallText.propTypes = {
  children: PropTypes.string,
};
