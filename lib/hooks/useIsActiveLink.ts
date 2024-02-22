import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * It's React Hook because we want this detection separated from Link.
 *
 * https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/ActiveLink.tsx
 */
export const useIsActiveLink = (
  /**
   * Dynamic route is matched via props.as, static route is matched via
   * props.href.
   */
  asOrHref: string,
) => {
  const { asPath, isReady } = useRouter();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    const linkPathname = new URL(asOrHref, location.href).pathname;
    const activePathname = new URL(asPath, location.href).pathname;
    setIsActive(linkPathname === activePathname);
  }, [asOrHref, asPath, isReady]);

  return isActive;
};
