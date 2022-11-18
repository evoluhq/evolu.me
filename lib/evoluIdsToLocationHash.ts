import { EvoluId } from "./db";
import { LocationHash } from "./useLocationHash";

export const evoluIdsToLocationHash = (ids: readonly EvoluId[]): LocationHash =>
  ids.join(",") as LocationHash;
