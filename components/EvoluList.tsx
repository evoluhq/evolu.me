import { useQuery } from "../lib/db";
import { EvoluListItem } from "./EvoluListItem";

export const EvoluList = () => {
  const { rows } = useQuery((db) =>
    db.selectFrom("evolu").select(["id", "title"]).orderBy("updatedAt")
  );

  return (
    <>
      {rows.map((row) => (
        <EvoluListItem key={row.id} row={row} />
      ))}
    </>
  );
};
