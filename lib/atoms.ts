import { atomWithStorage } from "jotai/utils";
import { useState } from "react";
import { NodeId, NodeMarkdown } from "./db";
import { createLocalStorageKey } from "./localStorage";

export const newNodeAtom = atomWithStorage<{
  md: string;
}>(createLocalStorageKey("newNodeAtom"), {
  md: "",
});

// export const newNodeTitleAtom = selectAtom(newNodeAtom, (v) => v.md);

export const useEditNodeAtom = (id: NodeId, md: NodeMarkdown) => {
  // I'm too lazy to write useRef with lazy initialization and types.
  const [atom] = useState(() =>
    atomWithStorage<{
      id: NodeId;
      md: string;
      originalMd: NodeMarkdown;
    }>(createLocalStorageKey(`editNodeAtom${id}:`), {
      id,
      md,
      originalMd: md,
    })
  );

  return atom;
};
