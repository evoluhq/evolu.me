import { useDeferredValue, useMemo } from "react";
import { useQuery } from "../lib/db";
import { KeyboardNavigationProvider } from "../lib/keyboardNavigation";
import { EvoluListItem } from "./EvoluListItem";

export const EvoluList = () => {
  const { rows } = useQuery((db) =>
    db.selectFrom("evolu").select(["id", "title"]).orderBy("createdAt")
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
        {({ x, y }) =>
          deferredRows.map((row, i) => (
            <EvoluListItem
              key={row.id}
              row={row}
              focusable={i === x && (y === 0 ? "button" : "input")}
              x={i}
            />
          ))
        }
      </KeyboardNavigationProvider>
    ),
    [deferredRows]
  );
};
