import { either, readonlyArray, string } from "fp-ts";
import { flow } from "fp-ts/function";
import { eqNodeId, NodeId } from "./db";
import { safeParseToEither } from "./safeParseToEither";
import { LocationHash } from "./hooks/useLocationHash";

export const locationHashToNodeIds: (hash: LocationHash) => readonly NodeId[] =
  flow(
    string.split(","),
    either.traverseArray((chunk) => safeParseToEither(NodeId.safeParse(chunk))),
    either.map(readonlyArray.uniq(eqNodeId)),
    either.getOrElseW(() => [])
  );
