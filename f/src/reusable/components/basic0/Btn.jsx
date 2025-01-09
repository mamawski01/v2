import PropTypes from "prop-types";
export default function Btn({
  children = <p>Btn</p>,
  onClick = () => {},
  type = "button",
  isPending = false,
  hoverColor = "hover:bg-zinc-900/50 backdrop-blur-sm",
}) {
  return (
    <button
      disabled={isPending}
      onClick={onClick}
      className={`${hoverColor} flex w-full items-center justify-between rounded p-1 transition-all duration-300 ${isPending ? "cursor-not-allowed" : ""}`}
      type={type}
    >
      {children}
    </button>
  );
}

Btn.propTypes = {
  children: PropTypes.node,
  hoverColor: PropTypes.string,
  isPending: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
};
