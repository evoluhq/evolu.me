import { NonEmptyString1000 } from "evolu";
import { memo } from "react";
import { NodeId } from "../lib/db";
import { useKeyNavigation } from "../lib/hooks/useKeyNavigation";
import { uniqueId } from "../lib/uniqueId";
import { Link } from "./Link";
import { NodeListItemButton } from "./NodeListItemButton";
import { View } from "./styled";
import { Text } from "./Text";

interface NodeListItemProps {
  row: {
    id: NodeId;
    title: NonEmptyString1000;
  };
  focusable: false | "button" | "input";
  x: number;
  isLast: boolean;
}

export const NodeListItem = memo<NodeListItemProps>(function NodeListItem({
  row: { id, title },
  focusable,
  x,
  isLast,
}) {
  const linkKeyNavigation = useKeyNavigation({
    x,
    y: 1,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: !isLast ? "nextX" : { id: uniqueId.createNodeInput },
      ArrowLeft: "previousY",
    },
  });

  return (
    <View className="flex-row" accessibilityRole={"listitem" as "list"}>
      <NodeListItemButton focusable={focusable === "button"} id={id} x={x} />
      <Link href={`/#${id}`}>
        <Text
          {...linkKeyNavigation}
          as="link"
          p
          className="pl-0"
          // @ts-expect-error RNfW
          focusable={focusable === "input"}
          nativeID={isLast ? uniqueId.lastNodeLink : undefined}
        >
          {title}
        </Text>
      </Link>
    </View>
  );
});
