import clsx from "clsx";
import { NonEmptyString1000 } from "evolu";
import { memo } from "react";
import { NodeId } from "../lib/db";
import { focusClassName, focusClassNames } from "../lib/focusClassNames";
import { useKeyNavigation } from "../lib/hooks/useKeyNavigation";
import { Link } from "./Link";
import { NodeItemButton } from "./NodeItemButton";
import { View } from "./styled";
import { Text } from "./Text";

interface NodeItemProps {
  row: {
    id: NodeId;
    title: NonEmptyString1000;
  };
  focusable: false | "button" | "input";
  x: number;
  isFirst: boolean;
  isLast: boolean;
}

export const NodeItem = memo<NodeItemProps>(function NodeItem({
  row: { id, title },
  focusable,
  x,
  isFirst,
  isLast,
}) {
  const linkKeyNavigation = useKeyNavigation({
    x,
    y: 1,
    keys: {
      ArrowUp: !isFirst ? "previousX" : focusClassName("firstNodeFilterLink"),
      ArrowDown: !isLast ? "nextX" : focusClassName("createNodeInput"),
      ArrowLeft: "previousY",
    },
  });

  return (
    <View className="flex-row" accessibilityRole={"listitem" as "list"}>
      <NodeItemButton
        focusable={focusable === "button"}
        id={id}
        x={x}
        isFirst={isFirst}
        isLast={isLast}
      />
      <Link href={`/#${id}`}>
        <Text
          {...linkKeyNavigation}
          as="link"
          p
          className={clsx(
            "pl-0",
            isLast && focusClassNames.lastNodeItemLink,
            isFirst && focusClassNames.firstNodeItemLink
          )}
          // @ts-expect-error RNfW
          focusable={focusable === "input"}
        >
          {title}
        </Text>
      </Link>
    </View>
  );
});
