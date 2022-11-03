import { model } from "evolu";
import { useDeferredValue, useMemo } from "react";
import { View } from "react-native";
import { useQuery } from "../lib/db";
import { KeyboardNavigationProvider } from "../lib/useKeyNavigation";
import { EvoluListItem } from "./EvoluListItem";

export const EvoluList = () => {
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
