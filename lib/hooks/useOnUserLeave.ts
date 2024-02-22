import { useEffect } from "react";

/**
 * React Hook to detect a user leaving the page. Leaving is detected by document
 * visibility change and component unmount. It allows us to postpone potentially
 * costly operations, for example, saving a lot of data.
 */
export const useOnUserLeave = (onUserLeave: () => void) => {
  useEffect(() => {
    // https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/
    // I don't think we need SWR window focus (blur in this case) approach.
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onUserLeave();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      onUserLeave();
    };
  }, [onUserLeave]);
};
