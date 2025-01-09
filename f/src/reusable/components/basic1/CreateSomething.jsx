import PropTypes from "prop-types";
import ContentBox1 from "../basic0/ContentBox1";
export default function CreateSomething({ children = "CreateSomething" }) {
  return <ContentBox1>{children}</ContentBox1>;
}

CreateSomething.propTypes = {
  children: PropTypes.node,
};
