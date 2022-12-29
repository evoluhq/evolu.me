import { atomWithStorage, selectAtom } from "jotai/utils";
import { NodeId } from "./db";
import { localStorageKeys } from "./localStorage";

export const newNodeAtom = atomWithStorage(localStorageKeys.newNodeAtom, {
  title: "",
});

export const editNodeAtom = atomWithStorage<null | {
  id: NodeId;
  title: string;
  originalTitle: string;
}>(localStorageKeys.editNodeAtom, null);

export const editNodeIdAtom = selectAtom(editNodeAtom, (v) => v?.id);

export const editNodeHasChangeAtom = selectAtom(
  editNodeAtom,
  (v) => v?.title !== v?.originalTitle
);
