import { NonEmptyString1000 } from "evolu";
import { constVoid } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useRouter } from "next/router";
import { memo } from "react";
import { NodeId } from "../lib/db";
import { getFirstLine } from "../lib/getFirstLine";
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
  onKeyEnter,
}) {
  const router = useRouter();

  const linkKeyNavigation = useKeyNavigation({
    x,
    y: 1,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: "nextX",
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

  return (
    <View className="flex-row" accessibilityRole={"listitem" as "list"}>
      <NodeItemButton focusable={focusable === "button"} id={id} x={x} />
      <Link href={`/#${id}`}>
        <Text
          {...linkKeyNavigation}
          as="link"
          p
          className="-ml-1 px-1"
          // @ts-expect-error RNfW
          focusable={focusable === "input"}
        >
          {getFirstLine(title)}
        </Text>
      </Link>
    </View>
  );
});
