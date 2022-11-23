import { String1000 } from "evolu";
import { IO } from "fp-ts/IO";
import { pipe } from "fp-ts/function";
import { memo, useContext } from "react";
import { TextInput as RnTextInput } from "react-native";
import { EvoluId, useMutation } from "../lib/db";
import {
  focusElementWithId,
  KeyboardNavigationContext,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { setSafeTimeout } from "../lib/setSafeTimeout";
import { uniqueId } from "../lib/uniqueId";
import { Link } from "./Link";
import { View } from "./styled";
import { T } from "./T";
import { useLocationHashEvoluIds } from "../lib/hooks/useLocationHashEvoluIds";
import { readonlyArray } from "fp-ts";
import { evoluIdsToLocationHash } from "../lib/evoluIdsToLocationHash";

interface EvoluListItemProps {
  row: {
    id: EvoluId;
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
    mutate("evolu", { id, isDeleted: true }, () => {
      setSafeTimeout(callback);
    });
  };

  const href = pipe(
    useLocationHashEvoluIds(),
    readonlyArray.append(id),
    evoluIdsToLocationHash,
    (s) => `/#${s}`
  );

  const keyNavigation = useKeyNavigation<RnTextInput>({
    x,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: !isLast ? "nextX" : { id: uniqueId.createEvoluInput },
      Backspace: deleteItem(
        isLast && x === 0
          ? () => focusElementWithId(uniqueId.createEvoluInput)
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
          nativeID={isLast ? uniqueId.lastEvoluInput : undefined}
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
