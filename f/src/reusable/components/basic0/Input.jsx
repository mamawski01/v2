import PropTypes from "prop-types";
export default function Input({
  id = "Input",
  type = "text",
  reg = () => {},
  isRequired = "",
}) {
  return (
    <input
      id={id}
      type={type}
      title={id}
      autoComplete="off"
      placeholder={id}
      {...reg(id, isRequired)}
      className="w-full rounded border border-gray-300/20 bg-inherit p-1 px-3 text-sm transition-all duration-500 placeholder:text-zinc-500 md:w-48"
    ></input>
  );
}

Input.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  reg: PropTypes.func,
  isRequired: PropTypes.object,
  type: PropTypes.string,
};
