import PropTypes from "prop-types";
import Datepicker from "react-tailwindcss-datepicker";

export default function Date({
  id = "Input",
  errors = {},
  Controller = () => {},
  control = {},
  rules = {},
}) {
  return (
    <div className="relative w-48">
      <Controller
        control={control}
        rules={rules}
        id={id}
        name={id}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Datepicker
              useRange={false}
              asSingle={true}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              startFrom={value?.startDate}
              inputClassName={
                "w-full rounded border border-gray-300/20 bg-inherit p-1 px-3 text-sm transition-all duration-500 placeholder:text-zinc-500  text-zinc-300"
              }
              toggleClassName="absolute rounded-r text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-800 hover:bg-zinc-700 transition-all duration-500"
              inputId={id}
            />
          </>
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

Date.propTypes = {
  Controller: PropTypes.func,
  control: PropTypes.object,
  errors: PropTypes.object,
  id: PropTypes.string,
  rules: PropTypes.object,
};
