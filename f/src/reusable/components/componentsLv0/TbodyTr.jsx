import PropTypes from "prop-types";
export default function TbodyTr({ children = "TbodyTr" }) {
  return (
    <tr className="w-full border-b border-gray-300/20 transition-all duration-300 hover:bg-zinc-900/50">
      {children}
    </tr>
  );
}

TbodyTr.propTypes = {
  children: PropTypes.node,
};
