import { ReactNode, useEffect, useState } from "react";

// atomWithStorage can't be rendered on the server.
// TODO: Use Next.js 13 "use client" when ready for production.
export const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return <>{children}</>;
};
