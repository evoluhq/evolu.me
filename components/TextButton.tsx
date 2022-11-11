import clsx from "clsx";
import { forwardRef } from "react";
import { PressableProps, View as RnView } from "react-native";
import { Paragraph } from "./Paragraph";
import { Pressable, Text, View } from "./styled";

const variantStyles = {
  primary: "dark:bg-gray-800 bg-gray-200",
  text: "hover:bg-gray-200",
};

export type TextButtonProps = Omit<PressableProps, "children"> & {
  title: string;
  variant?: keyof typeof variantStyles;
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
          variantStyles[variant]
        )}
      >
        <Text
          selectable={false}
          className="p-2 text-lg text-gray-900 dark:text-gray-200 dark:antialiased"
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
