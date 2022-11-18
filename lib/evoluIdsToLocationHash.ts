import { EvoluId } from "./db";
import { LocationHash } from "./hooks/useLocationHash";

export const evoluIdsToLocationHash = (ids: readonly EvoluId[]): LocationHash =>
  ids.join(",") as LocationHash;
