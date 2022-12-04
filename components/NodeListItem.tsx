import { NonEmptyString1000 } from "evolu";
import { memo } from "react";
import { NodeId } from "../lib/db";
import { Link } from "./Link";
import { View } from "./styled";
import { Text } from "./Text";

interface NodeListItemProps {
  row: {
    id: NodeId;
    title: NonEmptyString1000;
  };
  // focusable: boolean;
  // x: number;
  // isLast: boolean;
}

export const NodeListItem = memo<NodeListItemProps>(function NodeListItem({
  row: { id, title },
}) {
  return (
    <View className="flex-row" accessibilityRole={"listitem" as "list"}>
      <Link href={`/#${id}`}>
        <Text as="a">{title}</Text>
      </Link>
    </View>
  );
});
