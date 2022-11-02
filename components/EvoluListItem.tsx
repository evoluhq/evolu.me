import { String1000 } from "evolu";
import { memo, useCallback, useState } from "react";
import { useIntl } from "react-intl";
import { TextInput, View as RnView } from "react-native";
import { EvoluId, useMutation } from "../lib/db";
import { domFocus, domId } from "../lib/domId";
import { useKeyNavigation } from "../lib/useKeyNavigation";
import { EvoluTextInput } from "./EvoluTextInput";
import { Pressable, View } from "./styled";

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

  const inputKeyNavigation = useKeyNavigation<TextInput>({
    x,
    y: 1,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: !isLast ? "nextX" : domFocus("createEvoluInput"),
      ArrowLeft: [
        "previousY",
        ({ currentTarget: { selectionStart, selectionEnd } }) =>
          selectionStart === 0 && selectionEnd === 0,
      ],
      Escape: () => {
        setEditTitle(null);
      },
    },
  });

  if (title == null) return null;

  return (
    <View
      className="flex-row"
      // @ts-expect-error RNfW
      accessibilityRole="listitem"
    >
      <Pressable
        className="group -ml-2 w-9 items-center justify-center focus:outline-none"
        {...buttonKeyNavigation}
        focusable={focusable === "button"}
      >
        {/* for selection bg-gray-500 */}
        <View className="h-3 w-3 rounded-sm bg-gray-200 group-focus-visible:ring-2 dark:bg-gray-800" />
      </Pressable>
      <EvoluTextInput
        // accessibilityRole="listitem"
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
        {...(isLast && { nativeID: domId.lastEvoluInput })}
      />
    </View>
  );
});
