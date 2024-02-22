import { FC, ReactNode, useEffect, useState } from "react";

let firstRender = true;

export const ClientOnly: FC<{ children: ReactNode }> = ({ children }) => {
  // // This React feature isn't working yet.
  // // https://react.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-client-only-content
  // Once this will work, remove firstRender, add docs, and move component to
  // evolu common react.
  // if (typeof window === "undefined") {
  //   throw Error("ClientOnly should only render on the client.");
  // }

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    firstRender = false;
    setHasMounted(true);
  }, []);

  if (firstRender && !hasMounted) return null;

  return children;
};
