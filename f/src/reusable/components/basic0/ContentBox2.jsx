import PropTypes from "prop-types";
import { motion } from "framer-motion";

export default function ContentBox2({ children = "ContentBox2" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full items-center justify-center"
    >
      {children}
    </motion.div>
  );
}

ContentBox2.propTypes = {
  children: PropTypes.node,
};
