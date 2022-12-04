import clsx from "clsx";
import { styled } from "nativewind";
import { Text as RnText } from "react-native";

export const Text = styled(
  RnText,
  "text-gray-900 dark:text-gray-200 dark:antialiased",
  {
    variants: {
      as: {
        t: "",
        p: "mb-4",
        a: "rounded py-2 px-3 hover:underline focus:outline-none focus-visible:ring",
        button: clsx(
          "select-none rounded p-2 group-hover:bg-gray-200 group-focus-visible:ring",
          "dark:group-hover:bg-gray-900"
        ),
        roundedButton: clsx(
          "select-none rounded bg-gray-200 p-2 group-hover:bg-gray-300 group-focus-visible:ring",
          "dark:bg-gray-800 dark:group-hover:bg-gray-900"
        ),
        h1: "mb-4 mt-2 text-3xl",
        h2: "mb-4 mt-2 text-2xl",
        h3: "mb-4 mt-2 text-xl",
      },
      size: {
        medium: "text-lg",
        small: "text-base",
      },
    },
    defaultProps: {
      as: "t",
      size: "medium",
    },
  }
);
