import PropTypes from "prop-types";

export default function TheadTr({ children = "TheadTr" }) {
  return (
    <tr className="w-full border-b border-gray-300/20 text-zinc-600 transition-all duration-300 hover:bg-zinc-900/50">
      {children}
    </tr>
  );
}

TheadTr.propTypes = {
  children: PropTypes.node,
};
