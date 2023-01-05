import { atomWithStorage } from "jotai/utils";
import { localStorageKeys } from "./localStorage";

export const newNodeAtom = atomWithStorage(localStorageKeys.newNodeAtom, {
  md: "",
});

// export const newNodeTitleAtom = selectAtom(newNodeAtom, (v) => v.md);

// // TODO: Replace it with list of edited nodes.
// export const editNodeAtom = atomWithStorage<null | {
//   id: NodeId;
//   title: string;
//   originalTitle: string;
// }>(localStorageKeys.editNodeAtom, null);

// export const editNodeIdAtom = selectAtom(editNodeAtom, (v) => v?.id);

// export const editNodeHasChangeAtom = selectAtom(
//   editNodeAtom,
//   (v) => v?.title !== v?.originalTitle
// );
