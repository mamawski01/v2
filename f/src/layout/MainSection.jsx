import PropTypes from "prop-types";

export default function MainSection({ children }) {
  return (
    <section className="mx-auto flex min-w-full flex-1">{children}</section>
  );
}

MainSection.propTypes = {
  children: PropTypes.any,
};
