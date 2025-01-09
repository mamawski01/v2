import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { documentTitle } from "../../../lib/utils1";

export default function ContentBox0({ children = ContentBox0 }) {
  documentTitle();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-1 flex-col gap-4"
    >
      {children}
    </motion.div>
  );
}

ContentBox0.propTypes = {
  children: PropTypes.node,
};
