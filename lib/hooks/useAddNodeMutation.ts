import { NonEmptyString1000 } from "evolu";
import { useCallback } from "react";
import { useMutation } from "../db";
import { useLocationHashNodeIds } from "./useLocationHashNodeIds";
import { useScrollRestoration } from "./useScrollRestoration";

export const useAddNodeMutation = (): ((value: NonEmptyString1000) => void) => {
  const { mutate } = useMutation();
  const ids = useLocationHashNodeIds();
  const { requestScrollToEndAnimated } = useScrollRestoration();

  return useCallback(
    (value) => {
      const { id } = mutate("node", { title: value }, () => {
        requestScrollToEndAnimated();
      });
      ids.forEach((relatedId) => {
        // The edge direction doesn't matter.
        // We sort IDs to have always the same edge.
        const sortedTuple = [id, relatedId].sort();
        mutate("edge", { a: sortedTuple[0], b: sortedTuple[1] });
      });
    },
    [ids, mutate, requestScrollToEndAnimated]
  );
};
