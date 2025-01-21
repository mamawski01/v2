import PropTypes from "prop-types";
export default function Avatar({ src = "/TiberioEyecare.svg" }) {
  return (
    <div className="flex h-9 w-9">
      <img
        src={src}
        className={`w-9 rounded-full object-cover`}
        alt={src}
        title={src}
      ></img>
    </div>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  width: PropTypes.string,
};
