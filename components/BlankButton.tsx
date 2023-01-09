import clsx from "clsx";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { forwardRef } from "react";
import { GestureResponderEvent } from "react-native";
import useEvent from "react-use-event-hook";
import { createLocalStorageKey } from "../lib/localStorage";
import { Button, ButtonProps } from "./Button";
import { View } from "./styled";

const blankButtonPressedAtom = atomWithStorage(
  createLocalStorageKey("blankButtonPressed"),
  false
);

export interface BlankButtonProps extends ButtonProps {
  title: string;
  type: "square" | "circle";
  state?: "active";
}

// It's blank because its functionality is determined by its placement.
export const BlankButton = forwardRef<View, BlankButtonProps>(
  function BlankButton({ title, type, state, onPress, ...props }, ref) {
    const [blankButtonPressed, setBlankButtonPressed] = useAtom(
      blankButtonPressedAtom
    );

    const handlePress = useEvent((e: GestureResponderEvent) => {
      setBlankButtonPressed(true);
      if (onPress) onPress(e);
    });

    return (
      <Button
        accessibilityLabel={title}
        onPress={handlePress}
        {...props}
        ref={ref}
      >
        <View
          className={clsx(
            "top-[1px] mx-3 my-4 h-3 w-3 bg-gray-200 ring-current group-hover:bg-gray-300 group-focus-visible:ring-1 dark:bg-gray-800 dark:group-hover:bg-gray-900",
            type === "square" ? "rounded-sm" : "rounded-md",
            state === "active" && "scale-90",
            !blankButtonPressed && "animate-bounce"
          )}
        />
      </Button>
    );
  }
);
