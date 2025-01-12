import PropTypes from "prop-types";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    background: "inherit",
    width: "12rem",
    // borderColor: state.isFocused ? "inherit" : "#27272A",
    borderColor: "transparent",
    boxShadow: state.isFocused ? null : null,
    "&:hover": {
      boxShadow: "0px ",
    },
    height: "1rem",
  }),
  menu: (provided) => ({
    ...provided,
    background: "black",
  }),
  input: (provided) => ({ ...provided, color: "text-zinc-300" }),

  menuList: (provided) => ({
    ...provided,
    padding: 0,
    borderRadius: "3px",
    border: "1px solid #27272A",
    transition: "all 300ms",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "text-zinc-100",
  }),
  option: (provided, { isFocused }) => {
    return {
      ...provided,
      color: "text-zinc-300",
      backgroundColor: isFocused ? "#27272A" : "black",
      transition: "all 300ms",
    };
  },
};

const updatedStyles = {
  ...customStyles,
  control: (baseStyles, state) => ({
    ...customStyles.control(baseStyles, state),
    borderColor: state.isFocused ? "inherit" : "#27272A",
  }),
};

const className = {
  control: () => `border border-gray-600 rounded h-1 w-48`,
};

export default function Selector({
  id = "",
  Controller = () => {},
  control = {},
  errors = {},
  options = [
    { value: "male", label: "male" },
    { value: "female", label: "female" },
  ],
  transparentBorder = false,
  rules = {},
}) {
  return (
    <div>
      <Controller
        control={control}
        id={id}
        name={id}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Select
            options={options}
            classNames={className}
            styles={transparentBorder ? customStyles : updatedStyles}
            onBlur={onBlur}
            value={value}
            onChange={onChange}
            inputId={id}
          />
        )}
      ></Controller>
      <div
        className={`${errors?.[id]?.message ? `animate-pulse text-red-500` : `text-black`} transition-all duration-500`}
      >
        {errors?.[id]?.message}
      </div>
    </div>
  );
}

Selector.propTypes = {
  Controller: PropTypes.func,
  control: PropTypes.object,
  errors: PropTypes.object,
  id: PropTypes.string,
  options: PropTypes.array,
  rules: PropTypes.object,
  transparentBorder: PropTypes.bool,
};
