import { useEffect } from "react";

export function useRefresh() {
  return useEffect(() => {
    const intervalId = setInterval(() => {
      location.reload(true);
    }, 3000);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, 300000); // 5 minutes

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);
}
