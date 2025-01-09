import PropTypes from "prop-types";
import { motion } from "framer-motion";

import Input from "../basic0/Input";

export default function InputForm({
  id = "",
  reg,
  isRequired,
  errors = "",
  type = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-fit"
    >
      <Input type={type} id={id} reg={reg} isRequired={isRequired}></Input>
      <div
        className={`${errors?.[id]?.message ? `animate-pulse text-red-500` : `text-black`} transition-all duration-500`}
      >
        {errors?.[id]?.message}
      </div>
    </motion.div>
  );
}

InputForm.propTypes = {
  errors: PropTypes.object,
  id: PropTypes.string,
  isRequired: PropTypes.object,
  reg: PropTypes.func,
  type: PropTypes.string,
};
