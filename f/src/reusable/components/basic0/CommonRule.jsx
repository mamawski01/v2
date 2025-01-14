import PropTypes from "prop-types";

import Loading from "../basic1/Loading";
import ContentBox0 from "./ContentBox0";

export default function CommonRule({ children = "CommonRule", data, edit }) {
  if (!data && edit) return <Loading></Loading>;
  if (data) return <ContentBox0>{children}</ContentBox0>;
}

CommonRule.propTypes = {
  children: PropTypes.node,
  data: PropTypes.array,
  edit: PropTypes.bool,
};
