import { either, string } from "fp-ts";
import { flow } from "fp-ts/function";
import { EvoluId } from "./db";
import { safeParseToEither } from "./safeParseToEither";
import { LocationHash } from "./useLocationHash";

export const locationHashToEvoluIds: (
  hash: LocationHash
) => readonly EvoluId[] = flow(
  string.split(","),
  either.traverseArray((chunk) => safeParseToEither(EvoluId.safeParse(chunk))),
  either.getOrElseW(() => [])
);
