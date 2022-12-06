import { NonEmptyString1000 } from "evolu";
import { useCallback } from "react";
import { useMutation } from "../db";
import { layoutScroll } from "../layoutScroll";
import { useLocationHashNodeIds } from "./useLocationHashNodeIds";

export const useAddNodeMutation = (): ((value: NonEmptyString1000) => void) => {
  const { mutate } = useMutation();
  const ids = useLocationHashNodeIds();
  return useCallback(
    (value) => {
      const { id } = mutate(
        "node",
        { title: value },
        layoutScroll.requestScrollToEndAnimated
      );
      ids.forEach((relatedId) => {
        // The edge direction doesn't matter.
        // We sort IDs to have always the same edge.
        const sortedTuple = [id, relatedId].sort();
        mutate("edge", { a: sortedTuple[0], b: sortedTuple[1] });
      });
    },
    [ids, mutate]
  );
};
