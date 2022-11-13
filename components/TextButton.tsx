import clsx from "clsx";
import { forwardRef } from "react";
import { PressableProps, View as RnView } from "react-native";
import { styleVariant } from "../lib/styleVariant";
import { Paragraph } from "./Paragraph";
import { Pressable, Text, View } from "./styled";

export type TextButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: "primary" | "text";
  description?: string;
};

export const TextButton = forwardRef<RnView, TextButtonProps>(
  function TextButton(
    { title, variant = "primary", description, ...props },
    ref
  ) {
    const pressable = (
      <Pressable
        {...props}
        ref={ref}
        className={clsx(
          "rounded ring-inset hover:bg-gray-300 focus:outline-none focus-visible:ring-2 active:brightness-95 dark:hover:bg-gray-900 dark:active:brightness-90",
          styleVariant(variant, {
            primary: "bg-gray-200 dark:bg-gray-800",
            // small: "bg-gray-200 dark:bg-gray-800",
            text: "hover:bg-gray-200",
          })
        )}
      >
        <Text
          selectable={false}
          className={clsx(
            "p-2 text-lg text-gray-900 dark:text-gray-200 dark:antialiased",
            styleVariant(variant, {
              primary: "",
              // small: "px-2 py-1",
              text: "",
            })
          )}
        >
          {title}
        </Text>
      </Pressable>
    );

    if (!description) return pressable;

    return (
      <View className="mb-3">
        <View className="mb-1 flex-row">{pressable}</View>
        <View className="px-2">
          <Paragraph>{description}</Paragraph>
        </View>
      </View>
    );
  }
);
