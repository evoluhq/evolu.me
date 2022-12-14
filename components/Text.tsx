import clsx from "clsx";
import { styled } from "nativewind";
import { Text as RnText } from "react-native";

export const Text = styled(
  RnText,
  "text-gray-900 dark:text-gray-200 dark:antialiased",
  {
    variants: {
      as: {
        text: "",
        link: clsx(
          "rounded decoration-1 underline-offset-2 ring-current hover:underline",
          "focus:outline-none focus-visible:ring-1"
        ),
        button: clsx(
          "select-none rounded px-2 py-1 my-1 text-center",
          "ring-current group-focus-visible:ring-1",
          "group-hover:bg-gray-200 dark:group-hover:bg-gray-900"
        ),
        roundedButton: clsx(
          "select-none rounded px-2 py-1 my-1",
          "ring-current group-focus-visible:ring-1",
          "bg-gray-200 group-hover:bg-gray-300",
          "dark:bg-gray-800 dark:group-hover:bg-gray-900"
        ),
      },
      size: {
        sm: "text-base",
        base: "text-lg",
        big: "text-xl",
      },
      p: {
        true: "p-2",
      },
      mb: {
        true: "mb-4",
      },
      transparent: {
        true: "opacity-60",
      },
    },
    defaultProps: {
      as: "text",
      size: "base",
    },
  }
);
