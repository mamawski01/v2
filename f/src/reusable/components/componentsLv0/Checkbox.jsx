import PropTypes from "prop-types";

export default function Checkbox({
  children = "Checkbox",
  id = "checkbox",
  setChecked = () => {},
  checked = false,
}) {
  return (
    <div className="flex cursor-pointer items-center gap-2 align-middle">
      <input
        type="checkbox"
        id={id}
        defaultChecked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className={`h-4 w-4 cursor-pointer rounded-full border border-blue-500 bg-blue-500 outline-none focus:outline-none`}
      />
      <label
        className="cursor-pointer rounded pr-1 transition-all duration-300 hover:bg-zinc-900"
        htmlFor={id}
      >
        {children}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  children: PropTypes.node,
  id: PropTypes.string,
  setChecked: PropTypes.func,
};
