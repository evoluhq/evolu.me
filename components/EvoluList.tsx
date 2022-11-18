import { model } from "evolu";
import { useDeferredValue, useMemo } from "react";
import { useQuery } from "../lib/db";
import { KeyboardNavigationProvider } from "../lib/hooks/useKeyNavigation";
import { EvoluListItem } from "./EvoluListItem";
import { View } from "./styled";

export const EvoluList = () => {
  // const ids = useLocationHashEvoluIds();
  // const { rows: foo } = useQuery((db) =>
  //   db.selectFrom("evoluEdge").selectAll()
  // );
  // console.log(foo);

  const { rows } = useQuery((db) =>
    db
      .selectFrom("evolu")
      .select(["id", "title"])
      .orderBy("createdAt")
      .where("isDeleted", "is not", model.cast(true))
  );

  // Ensure the list is rendered at the same time as CreateEvolu setTitle("").
  // https://github.com/reactwg/react-18/discussions/86#discussioncomment-1345270
  const deferredRows = useDeferredValue(rows);

  return useMemo(
    () => (
      <KeyboardNavigationProvider
        maxX={deferredRows.length - 1}
        maxY={1}
        initialY={1}
      >
        {({ x, y }) => (
          <View accessibilityRole="list">
            {deferredRows.map((row, i) => (
              <EvoluListItem
                key={row.id}
                row={row}
                x={i}
                focusable={i === x && (y === 0 ? "button" : "input")}
                isLast={i === deferredRows.length - 1}
              />
            ))}
          </View>
        )}
      </KeyboardNavigationProvider>
    ),
    [deferredRows]
  );
};
