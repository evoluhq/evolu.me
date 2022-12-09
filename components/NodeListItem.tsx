import { NonEmptyString1000 } from "evolu";
import { memo } from "react";
import { NodeId } from "../lib/db";
import { useKeyNavigation } from "../lib/hooks/useKeyNavigation";
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
  // isLast: boolean;
}

export const NodeListItem = memo<NodeListItemProps>(function NodeListItem({
  row: { id, title },
  focusable,
  x,
}) {
  const linkKeyNavigation = useKeyNavigation({
    x,
    y: 1,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: "nextX",
      ArrowLeft: "previousY",
      // ArrowDown: !isLast ? "nextX" : { id: uniqueId.createEvoluInput },
      // ArrowLeft: [
      //   "previousY",
      //   ({ currentTarget: { selectionStart, selectionEnd } }) =>
      //     selectionStart === 0 && selectionEnd === 0,
      // ],
      // Escape: () => {
      //   setEditTitle(null);
      // },
      // Backspace: [
      //   () => {
      //     mutate("evolu", { id, isDeleted: true }, () => {
      //       if (x === 0) {
      //         if (isLast) focusElementWithId(uniqueId.createEvoluInput);
      //         else {
      //           setSafeTimeout(() => {
      //             move("current");
      //           });
      //         }
      //       } else move("previousX");
      //     });
      //   },
      //   () => (hasChange ? editTitle.length === 0 : title?.length === 0),
      // ],
      // Enter: [{ id: uniqueId.createEvoluInput }, () => !hasChange],
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
        >
          {title}
        </Text>
      </Link>
    </View>
  );
});
