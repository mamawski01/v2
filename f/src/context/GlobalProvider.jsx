import PropTypes from "prop-types";
import { GlobalContext } from "./GlobalContext";
import { urlEvents, useLocalStorage } from "../reusable/hooks/useHook1";
import Loading from "../reusable/components/basic1/Loading";

export default function GlobalProvider({ children }) {
  const [user, userSet] = useLocalStorage("user", {
    username: "Guest",
    token: undefined,
  });
  console.log(user);

  if (urlEvents.length === 0) return <Loading></Loading>;

  if (urlEvents) {
    return (
      <GlobalContext.Provider value={{ urlEvents, user, userSet }}>
        {children}
      </GlobalContext.Provider>
    );
  }
}

GlobalProvider.propTypes = {
  children: PropTypes.any,
};
