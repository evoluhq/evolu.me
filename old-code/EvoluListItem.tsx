import { String1000 } from "evolu";
import { IO } from "fp-ts/IO";
import { pipe } from "fp-ts/function";
import { memo, useContext } from "react";
import { TextInput as RnTextInput } from "react-native";
import { NodeId, useMutation } from "../lib/db";
import {
  focusElementWithId,
  KeyboardNavigationContext,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { setSafeTimeout } from "./setSafeTimeout";
import { uniqueId } from "../lib/uniqueId";
import { Link } from "../components/Link";
import { View } from "../components/styled";
import { T } from "./T";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { readonlyArray } from "fp-ts";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";

interface EvoluListItemProps {
  row: {
    id: NodeId;
    title: String1000;
  };
  focusable: boolean;
  x: number;
  isLast: boolean;
}

export const EvoluListItem = memo<EvoluListItemProps>(function EvoluListItem({
  row: { id, title },
  focusable,
  x,
  isLast,
}) {
  const { mutate } = useMutation();
  const { move } = useContext(KeyboardNavigationContext);

  const deleteItem = (callback: IO<void>) => () => {
    mutate("node", { id, isDeleted: true }, () => {
      setSafeTimeout(callback);
    });
  };

  const href = pipe(
    useLocationHashNodeIds(),
    readonlyArray.append(id),
    nodeIdsToLocationHash,
    (s) => `/#${s}`
  );

  const keyNavigation = useKeyNavigation<RnTextInput>({
    x,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: !isLast ? "nextX" : { id: uniqueId.createNodeInput },
      Backspace: deleteItem(
        isLast && x === 0
          ? () => focusElementWithId(uniqueId.createNodeInput)
          : () => move("current")
      ),
    },
  });

  return (
    <View
      className="flex-row"
      // @ts-expect-error RNfW
      accessibilityRole="listitem"
    >
      <Link href={href}>
        <T
          v="tb"
          nativeID={isLast ? uniqueId.lastNodeLink : undefined}
          {...keyNavigation}
          focusable={focusable}
          customClassName="flex-1"
        >
          {title}
        </T>
      </Link>
    </View>
  );
});
