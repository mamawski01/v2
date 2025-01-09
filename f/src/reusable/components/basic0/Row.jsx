import PropTypes from "prop-types";
export default function Row({ children = "Row", wider = false }) {
  return (
    <div
      className={`grid w-full flex-1 auto-cols-auto grid-flow-row grid-cols-subgrid gap-4 text-start transition-all duration-500 ${wider ? "sm:[grid-template-columns:repeat(auto-fit,minmax(30rem,1fr))]" : "sm:[grid-template-columns:repeat(auto-fit,minmax(13rem,1fr))]"}`}
    >
      {children}
    </div>
  );
}

Row.propTypes = {
  children: PropTypes.node,
  wider: PropTypes.bool,
};
