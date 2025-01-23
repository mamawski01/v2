import { useContext } from "react";
import { createContext } from "react";

export default function useUserSchedule() {
  const context = useContext(UserScheduleContext);
  if (context === undefined)
    throw new Error(
      "UserScheduleContext was used outside UserScheduleProvider",
    );
  return context;
}

export const UserScheduleContext = createContext();

export const style = `w-fit rounded bg-zinc-800 hover:bg-zinc-600 p-1 text-xs`;
