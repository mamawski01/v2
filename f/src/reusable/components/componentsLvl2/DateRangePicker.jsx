import dayjs from "dayjs";
import PropTypes from "prop-types";
import Datepicker from "react-tailwindcss-datepicker";

export default function DateRangePicker({ value, valueSet, placeholder }) {
  return (
    <div className="w-64">
      <Datepicker
        separator="to"
        showShortcuts={true}
        configs={{
          shortcuts: {
            pastMonth: "Last month",
            currentMonth: "This month",
            next8Days: {
              text: "Next month",
              period: {
                start: dayjs().add(1, "month").startOf("month").toDate(),
                end: dayjs().add(1, "month").endOf("month").toDate(),
              },
            },
          },
        }}
        value={value}
        onChange={(newValue) => valueSet(newValue)}
        inputClassName={
          "w-full rounded border border-gray-300/20 bg-inherit p-1 px-3 text-sm transition-all duration-500 placeholder:text-zinc-500 text-zinc-300 h-full"
        }
        toggleClassName="absolute rounded-r text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed bg-zinc-800 hover:bg-zinc-700 transition-all duration-500"
        placeholder={placeholder}
        inputId="DateRangePicker"
      />
    </div>
  );
}

DateRangePicker.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.any,
  valueSet: PropTypes.func,
};
