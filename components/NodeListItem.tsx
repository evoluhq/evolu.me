import { NonEmptyString1000 } from "evolu";
import { constVoid } from "fp-ts/function";
import { memo } from "react";
import { NodeId } from "../lib/db";
import { Link } from "./Link";
import { NodeListItemButton } from "./NodeListItemButton";
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
      <NodeListItemButton
        focusable={false}
        onFocus={constVoid}
        id={id}
        title={title}
      />
      <Link href={`/#${id}`}>
        <Text as="link" p className="pl-0">
          {title}
        </Text>
      </Link>
    </View>
  );
});
