import PropTypes from "prop-types";
import { GlobalContext } from "./GlobalContext";
import { urlEvents, usePreFetch } from "../reusable/hooks/useHook1";
import Loading from "../reusable/components/basic1/Loading";

export default function GlobalProvider({ children }) {
  const urlArr = urlEvents && urlEvents.filter((url) => url.includes("getAll"));

  const preFetchArr = [...(urlArr ?? [])];
  usePreFetch(preFetchArr);

  if (!urlEvents) return <Loading></Loading>;
  if (urlEvents) {
    return (
      <GlobalContext.Provider value={{ urlEvents }}>
        {children}
      </GlobalContext.Provider>
    );
  }
}

GlobalProvider.propTypes = {
  children: PropTypes.any,
};
