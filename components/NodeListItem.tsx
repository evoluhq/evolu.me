import { NonEmptyString1000 } from "evolu";
import { memo } from "react";
import { NodeId } from "../lib/db";
import { useKeyNavigation } from "../lib/hooks/useKeyNavigation";
import { Link } from "./Link";
import { NodeListItemButton } from "./NodeListItemButton";
import { View } from "./styled";
import { Text } from "./Text";
import { View as RnView, Text as RnText } from "react-native";

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
  const buttonKeyNavigation = useKeyNavigation<RnView>({
    x,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: "nextX",
      ArrowRight: "nextY",
    },
  });

  const inputKeyNavigation = useKeyNavigation<RnText>({
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
      <NodeListItemButton
        {...buttonKeyNavigation}
        focusable={focusable === "button"}
        id={id}
        title={title}
      />
      <Link href={`/#${id}`}>
        <Text
          {...inputKeyNavigation}
          // @ts-expect-error RNfW
          focusable={focusable === "input"}
          as="link"
          p
          className="pl-0"
        >
          {title}
        </Text>
      </Link>
    </View>
  );
});
