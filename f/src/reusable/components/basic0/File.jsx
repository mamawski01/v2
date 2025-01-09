import PropTypes from "prop-types";
import { useState } from "react";

export default function File({
  id = "Input",
  reg = () => {},
  isRequired,
  errors = "",
  specifyFile = "",
  getValues = () => {},
}) {
  const [filePrev, filePrevSet] = useState();
  function getFilePreview(e) {
    if (e.target.files[0]) {
      return filePrevSet(URL.createObjectURL(e.target.files[0]));
    } else return filePrevSet("/Asset2.png");
  }
  return (
    <div className="w-48 cursor-pointer">
      <input
        id={id}
        title={id}
        type="file"
        {...reg(id, isRequired)}
        onChange={(e) => getFilePreview(e)}
        accept={specifyFile}
        className="inputBtn-color w-full cursor-pointer rounded border border-gray-300/20 bg-inherit text-sm transition-all duration-500 placeholder:text-zinc-500"
      />
      <div
        className={`${errors?.[id]?.message ? `animate-pulse text-red-500` : `text-black`} transition-all duration-500`}
      >
        {errors?.[id]?.message}
      </div>
      <img
        src={filePrev || getValues(id) || "/TiberioEyecare.svg"}
        alt=""
        className="mt-2 h-auto w-full"
      />
    </div>
  );
}

File.propTypes = {
  errors: PropTypes.object,
  getValues: PropTypes.func,
  id: PropTypes.string,
  isRequired: PropTypes.object,
  reg: PropTypes.func,
  specifyFile: PropTypes.string,
};
