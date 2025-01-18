import PropTypes from "prop-types";
import { useGlobal } from "./globalHook";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoutes({ children }) {
  const { user } = useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.token === undefined) {
      navigate("/homepage/login", { replace: true });
    }
  }, [navigate, user]);
  if (user.token !== undefined) return children;
}

ProtectedRoutes.propTypes = {
  children: PropTypes.node,
};
