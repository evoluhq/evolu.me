import { useDeferredValue, useMemo } from "react";
import { useQuery } from "../lib/db";
import { EvoluListItem } from "./EvoluListItem";

export const EvoluList = () => {
  const { rows } = useQuery((db) =>
    db.selectFrom("evolu").select(["id", "title"]).orderBy("createdAt")
  );
  const deferredRows = useDeferredValue(rows);

  // Ensure the list is rendered at the same time as CreateEvolu setTitle("").
  // https://github.com/reactwg/react-18/discussions/86#discussioncomment-1345270
  return useMemo(
    () => (
      <>
        {deferredRows.map((row) => (
          <EvoluListItem key={row.id} row={row} />
        ))}
      </>
    ),
    [deferredRows]
  );
};
