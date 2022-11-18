import { either, readonlyArray, string } from "fp-ts";
import { flow } from "fp-ts/function";
import { eqEvoluId, EvoluId } from "./db";
import { safeParseToEither } from "./safeParseToEither";
import { LocationHash } from "./useLocationHash";

export const locationHashToEvoluIds: (
  hash: LocationHash
) => readonly EvoluId[] = flow(
  string.split(","),
  either.traverseArray((chunk) => safeParseToEither(EvoluId.safeParse(chunk))),
  either.map(readonlyArray.uniq(eqEvoluId)),
  either.getOrElseW(() => [])
);
