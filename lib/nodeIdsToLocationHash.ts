import { NodeId } from "./db";
import { LocationHash } from "./hooks/useLocationHash";

export const nodeIdsToLocationHash = (ids: readonly NodeId[]): LocationHash =>
  ids.join(",") as LocationHash;
