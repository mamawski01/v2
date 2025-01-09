import PropTypes from "prop-types";

export default function MainSideBar({ children }) {
  return (
    <div className="scrollbar hidden flex-col gap-2 border-r border-gray-300/20 p-5 px-2 hover:overflow-y-scroll md:flex md:w-48 md:flex-nowrap lg:w-56">
      {children}
    </div>
  );
}

MainSideBar.propTypes = {
  children: PropTypes.node,
};
