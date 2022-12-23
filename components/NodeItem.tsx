import clsx from "clsx";
import { NonEmptyString1000 } from "evolu";
import { constVoid } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { memo } from "react";
import { editNodeIdAtom } from "../lib/atoms";
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
  onKeyEnter: IO<void>;
}

export const NodeItem = memo<NodeItemProps>(function NodeItem({
  row: { id, title },
  focusable,
  x,
  isFirst,
  isLast,
  onKeyEnter,
}) {
  const router = useRouter();

  const linkKeyNavigation = useKeyNavigation({
    x,
    y: 1,
    keys: {
      ArrowUp: !isFirst ? "previousX" : focusClassName("firstNodeFilterLink"),
      ArrowDown: !isLast ? "nextX" : focusClassName("createNodeInput"),
      ArrowLeft: "previousY",
      Escape: () => router.back(),
      Enter: [
        constVoid,
        () => {
          onKeyEnter();
          return false;
        },
      ],
    },
  });

  const editNodeId = useAtomValue(editNodeIdAtom);

  return (
    <View className="flex-row" accessibilityRole={"listitem" as "list"}>
      <NodeItemButton
        focusable={focusable === "button"}
        id={id}
        x={x}
        isFirst={isFirst}
        isLast={isLast}
        title={title}
      />
      <Link href={`/#${id}`}>
        <Text
          {...linkKeyNavigation}
          as="link"
          p
          transparent={id === editNodeId}
          className={clsx(
            "-ml-1 px-1",
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
