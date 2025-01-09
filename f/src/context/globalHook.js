import { useContext } from "react";
import { GlobalContext } from "./GlobalContext";

export function useGlobal() {
  const context = useContext(GlobalContext);
  if (context === undefined)
    throw new Error("GlobalContext was used outside GlobalProvider");
  return context;
}
