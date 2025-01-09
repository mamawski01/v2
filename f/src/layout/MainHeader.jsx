import PropTypes from "prop-types"
 "../reusable/components/componentsLvl1/Logo";

export default function MainHeader({children}) {
  return (
    <header className="sticky top-0 z-10 flex h-12 items-center gap-4 border-b border-gray-300/20 bg-black/60 p-3 backdrop-blur-sm">
      {children}
    </header>
  );
}

MainHeader.propTypes = {
  children: PropTypes.node
}
