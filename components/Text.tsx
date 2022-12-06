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
        link: "rounded hover:underline focus:outline-none focus-visible:ring",
        button: clsx(
          "select-none rounded p-2 group-hover:bg-gray-200 group-focus-visible:ring",
          "dark:group-hover:bg-gray-900"
        ),
        roundedButton: clsx(
          "select-none rounded bg-gray-200 p-2 group-hover:bg-gray-300 group-focus-visible:ring",
          "dark:bg-gray-800 dark:group-hover:bg-gray-900"
        ),
      },
      size: {
        sm: "text-base",
        base: "text-lg",
        big: "text-xl",
      },
      p: {
        base: "p-2",
      },
      mb: {
        base: "mb-4",
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
