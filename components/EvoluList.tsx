import { View } from "react-native";
import { useQuery } from "../lib/db";
import { EvoluListItem } from "./EvoluListItem";

export const EvoluList = () => {
  const { rows } = useQuery((db) =>
    db.selectFrom("evolu").select(["id", "title"]).orderBy("updatedAt")
  );

  return (
    <View className="gap-y-4">
      {rows.map((row) => (
        <EvoluListItem key={row.id} row={row} />
      ))}
    </View>
  );
};
