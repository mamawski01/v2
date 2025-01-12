import PropTypes from "prop-types";
export default function Label({ children = "Label", htmlFor = "Label" }) {
  return (
    <label
      className="flex w-full flex-col flex-wrap items-center justify-center gap-1 text-sm"
      htmlFor={htmlFor}
      title={htmlFor}
    >
      {children}
    </label>
  );
}

Label.propTypes = {
  children: PropTypes.node,
  htmlFor: PropTypes.string,
};
