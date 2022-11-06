import { ReactNode, useEffect, useState } from "react";

// Because of atomWithStorage, it can't be rendered on the server.
// It will be replaced with Next.js 13 "use client".
export const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <>{children}</>;
};
