import PropTypes from "prop-types";
import { useGlobal } from "./globalHook";
import { useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const { user } = useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === "Guest") {
      navigate("/homepage/login", { replace: true });
    }
  }, [navigate, user]);
  return children;
}

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};
