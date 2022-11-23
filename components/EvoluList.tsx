import { has, model } from "evolu";
import { useDeferredValue, useMemo } from "react";
import { useQuery } from "../lib/db";
import { KeyboardNavigationProvider } from "../lib/hooks/useKeyNavigation";
import { useLocationHashEvoluIds } from "../lib/hooks/useLocationHashEvoluIds";
import { EvoluListItem } from "./EvoluListItem";
import { View } from "./styled";

export const EvoluList = () => {
  const ids = useLocationHashEvoluIds();

  const { rows } = useQuery((db) => {
    let q = db
      .selectFrom("evolu")
      .select(["id", "title"])
      .orderBy("createdAt")
      .where("isDeleted", "is not", model.cast(true));

    ids.forEach((relatedId) => {
      q = q.where("id", "in", (qb) =>
        qb
          .selectFrom("evoluEdge")
          .where("b", "=", relatedId)
          .select("a as id")
          .union(
            qb
              .selectFrom("evoluEdge")
              .where("a", "=", relatedId)
              .select("b as id")
          )
      );
    });

    return q;
  });

  // Ensure the list is rendered at the same time as CreateEvolu setTitle("").
  // https://github.com/reactwg/react-18/discussions/86#discussioncomment-1345270
  const deferredRows = useDeferredValue(rows);
  const loadedRows = useMemo(
    () => deferredRows.filter(has(["title"])),
    [deferredRows]
  );

  return useMemo(
    () => (
      <KeyboardNavigationProvider maxX={loadedRows.length - 1}>
        {({ x }) => (
          <View accessibilityRole="list">
            {loadedRows.map((row, i) => (
              <EvoluListItem
                key={row.id}
                row={row}
                x={i}
                focusable={i === x}
                isLast={i === loadedRows.length - 1}
              />
            ))}
          </View>
        )}
      </KeyboardNavigationProvider>
    ),
    [loadedRows]
  );
};
