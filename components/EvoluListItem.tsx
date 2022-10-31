import { String1000 } from "evolu";
import { KeyboardEvent, memo, useCallback, useContext, useState } from "react";
import { TextInput, View as RnView } from "react-native";
import { EvoluId, useMutation } from "../lib/db";
import {
  KeyboardNavigationContext,
  useKeyboardNavigationRef,
} from "../lib/keyboardNavigation";
import { EvoluTextInput } from "./EvoluTextInput";
import { Pressable, View } from "./styled";

interface EvoluListItemProps {
  row: {
    id: EvoluId;
    title: String1000 | null;
  };
  focusable: false | "button" | "input";
  x: number;
}

export const EvoluListItem = memo<EvoluListItemProps>(function EvoluListItem({
  row: { id, title },
  focusable,
  x,
}) {
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

  const buttonRef = useKeyboardNavigationRef<RnView>(x, 0);
  const inputRef = useKeyboardNavigationRef<TextInput>(x, 1);

  const { move, onFocus } = useContext(KeyboardNavigationContext);

  const handleInputKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        move("previousX");
        break;
      case "ArrowDown":
        e.preventDefault();
        move("nextX");
        break;
      case "ArrowLeft":
        if (e.currentTarget.selectionStart === 0) move("previousY");
        break;
    }
  };

  const handleButtonKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        move("previousX");
        break;
      case "ArrowDown":
        e.preventDefault();
        move("nextX");
        break;
      case "ArrowRight":
        move("nextY");
        break;
    }
  };

  if (title == null) return null;

  return (
    <View className="flex-row">
      <Pressable
        className="-ml-2 h-full w-8 items-center justify-center"
        focusable={focusable === "button"}
        ref={buttonRef}
        onFocus={() => onFocus({ x, y: 0 })}
        // @ts-expect-error Web
        onKeyDown={handleButtonKeyPress}
      >
        <View className="h-3 w-3 rounded-sm dark:bg-gray-800" />
      </Pressable>
      <EvoluTextInput
        value={editTitle != null ? editTitle : title}
        onChangeText={setEditTitle}
        hasUnsavedChange={hasChange}
        onSubmitEditing={handleSubmitEditing}
        onBlur={handleSubmitEditing}
        focusable={focusable === "input"}
        ref={inputRef}
        onFocus={() => onFocus({ x, y: 1 })}
        onKeyPress={handleInputKeyPress}
      />
    </View>
  );
});
