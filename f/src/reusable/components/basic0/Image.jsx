import PropTypes from "prop-types";
export default function Image({ src = "/TiberioEyecare.svg", width = "w-10" }) {
  return <img src={src} className={width} alt={src} title={src}></img>;
}

Image.propTypes = {
  src: PropTypes.string,
  width: PropTypes.string,
};
