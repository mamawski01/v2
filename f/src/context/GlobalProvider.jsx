import PropTypes from "prop-types";
import { GlobalContext } from "./GlobalContext";
import { urlData, usePreFetch } from "../reusable/hooks/useHook1";

export default function GlobalProvider({ children }) {
  const urlArr = urlData && urlData.filter((url) => url.includes("GetAll"));
  const preFetchArr = [...(urlArr ?? [])];
  usePreFetch(preFetchArr);

  if (urlData) {
    return (
      <GlobalContext.Provider value={{ urlData }}>
        {children}
      </GlobalContext.Provider>
    );
  }
}

GlobalProvider.propTypes = {
  children: PropTypes.any,
};
