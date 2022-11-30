import { styled } from "nativewind";
import { Text as RnText } from "react-native";

export const Text = styled(
  RnText,
  "text-lg text-gray-900 dark:text-gray-200 dark:antialiased",
  {
    variants: {
      as: {
        p: "mb-4",
        a: "py-2 px-3 focus:outline-none hocus:underline",
        button:
          "select-none rounded p-2 focus:outline-none hocus:bg-gray-200 group-hocus:bg-gray-200 dark:hocus:bg-gray-900 dark:group-hocus:bg-gray-900",
        roundedButton:
          "select-none rounded bg-gray-200 p-2 group-hocus:bg-gray-300 dark:bg-gray-800 dark:group-hocus:bg-gray-900",
        h1: "mb-4 mt-2 text-3xl",
        h2: "mb-4 mt-2 text-2xl",
        h3: "mb-4 mt-2 text-xl",
      },
    },
    defaultProps: {
      as: "p",
    },
  }
);
