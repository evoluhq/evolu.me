import { atomWithStorage } from "jotai/utils";
import { NodeId } from "./db";
import { localStorageKeys } from "./localStorage";

export const newNodeTitleAtom = atomWithStorage(
  localStorageKeys.newNodeTitle,
  ""
);

export const editNodeTitleAtom = atomWithStorage(
  localStorageKeys.editNodeTitle,
  ""
);

export const editNodeIdAtom = atomWithStorage<NodeId | null>(
  localStorageKeys.editNodeId,
  null
);
