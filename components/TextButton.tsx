import { forwardRef } from "react";
import { PressableProps, View as RnView } from "react-native";
import { Pressable, Text } from "./styled";

export type TextButtonProps = Omit<PressableProps, "children"> & {
  title: string;
};

export const TextButton = forwardRef<RnView, TextButtonProps>(
  function TextButton({ title, ...props }, ref) {
    return (
      <Pressable
        {...props}
        ref={ref}
        className="rounded ring-inset focus:outline-none focus-visible:ring-2"
      >
        <Text className="p-2 text-lg text-gray-900 dark:text-gray-200">
          {title}
        </Text>
      </Pressable>
    );
  }
);
