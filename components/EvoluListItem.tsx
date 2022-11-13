import { String1000 } from "evolu";
import { memo, useCallback, useContext, useState } from "react";
import { useIntl } from "react-intl";
import { TextInput as RnTextInput, View as RnView } from "react-native";
import { EvoluId, useMutation } from "../lib/db";
import { setSafeTimeout } from "../lib/setSafeTimeout";
import { uniqueId } from "../lib/uniqueId";
import {
  focusElementWithId,
  KeyboardNavigationContext,
  useKeyNavigation,
} from "../lib/useKeyNavigation";
import { EvoluButton } from "./EvoluButton";
import { EvoluTextInput } from "./EvoluTextInput";
import { View } from "./styled";

interface EvoluListItemProps {
  row: {
    id: EvoluId;
    title: String1000 | null;
  };
  focusable: false | "button" | "input";
  x: number;
  isLast: boolean;
}

export const EvoluListItem = memo<EvoluListItemProps>(function EvoluListItem({
  row: { id, title },
  focusable,
  x,
  isLast,
}) {
  const intl = useIntl();
  const [editTitle, setEditTitle] = useState<string | null>(null);
  const hasChange = editTitle != null && editTitle !== title;
  const { mutate } = useMutation();

  const handleSubmitEditing = useCallback(() => {
    if (hasChange) {
      // `as String1000` because EvoluTextInput maxLength is 1000.
      mutate("evolu", { id, title: editTitle as String1000 }, () => {
        setEditTitle(null);
      });
    } else {
      setEditTitle(null);
    }
  }, [editTitle, hasChange, id, mutate]);

  const buttonKeyNavigation = useKeyNavigation<RnView>({
    x,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: "nextX",
      ArrowRight: "nextY",
    },
  });

  const { move } = useContext(KeyboardNavigationContext);

  const inputKeyNavigation = useKeyNavigation<RnTextInput>({
    x,
    y: 1,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: !isLast ? "nextX" : { id: uniqueId.createEvoluInput },
      ArrowLeft: [
        "previousY",
        ({ currentTarget: { selectionStart, selectionEnd } }) =>
          selectionStart === 0 && selectionEnd === 0,
      ],
      Escape: () => {
        setEditTitle(null);
      },
      Backspace: [
        () => {
          mutate("evolu", { id, isDeleted: true }, () => {
            if (x === 0) {
              if (isLast) focusElementWithId(uniqueId.createEvoluInput);
              else {
                setSafeTimeout(() => {
                  move("current");
                });
              }
            } else move("previousX");
          });
        },
        () => (hasChange ? editTitle.length === 0 : title?.length === 0),
      ],
      Enter: [{ id: uniqueId.createEvoluInput }, () => !hasChange],
    },
  });

  if (title == null) return null;

  return (
    <View
      className="flex-row"
      // @ts-expect-error RNfW
      accessibilityRole="listitem"
    >
      <EvoluButton
        {...buttonKeyNavigation}
        focusable={focusable === "button"}
        title={title}
        id={id}
      />
      <EvoluTextInput
        accessibilityLabel={intl.formatMessage({
          defaultMessage: "A Evolu item",
          id: "t2ZKjf",
        })}
        value={editTitle != null ? editTitle : title}
        onChangeText={setEditTitle}
        hasUnsavedChange={hasChange}
        onSubmitEditing={handleSubmitEditing}
        onBlur={handleSubmitEditing}
        {...inputKeyNavigation}
        focusable={focusable === "input"}
        nativeID={isLast ? uniqueId.lastEvoluInput : undefined}
      />
    </View>
  );
});
