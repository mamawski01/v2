import { motion } from "framer-motion";
import PropTypes from "prop-types";

export default function ContentBox1({ children = ContentBox1 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex w-full flex-1 flex-col items-center justify-center gap-2 rounded border border-gray-300/20 p-2 text-center"
    >
      {children}
    </motion.div>
  );
}

ContentBox1.propTypes = {
  children: PropTypes.node,
};
