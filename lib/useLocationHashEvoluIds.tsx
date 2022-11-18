import { useMemo } from "react";
import { locationHashToEvoluIds } from "./locationHashToEvoluIds";
import { useLocationHash } from "./useLocationHash";

export const useLocationHashEvoluIds = () => {
  const hash = useLocationHash();
  // To have a stable reference.
  return useMemo(() => locationHashToEvoluIds(hash), [hash]);
};
