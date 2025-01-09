import PropTypes from "prop-types";
export default function ProfilePicture({ src = "/TiberioEyecare.svg" }) {
  return (
    <div className="flex h-32 w-32 transition-all duration-300 hover:my-8">
      <img
        src={src}
        className="rounded-full object-cover transition-all duration-300 ease-in-out hover:scale-150"
        alt={src}
        title={src}
      ></img>
    </div>
  );
}

ProfilePicture.propTypes = {
  src: PropTypes.string,
  width: PropTypes.string,
};
