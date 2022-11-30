import { useMemo } from "react";
import { locationHashToNodeIds } from "../locationHashToNodeIds";
import { useLocationHash } from "./useLocationHash";

export const useLocationHashNodeIds = () => {
  const hash = useLocationHash();
  // To have a stable reference.
  return useMemo(() => locationHashToNodeIds(hash), [hash]);
};
