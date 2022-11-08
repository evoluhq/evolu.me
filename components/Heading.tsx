import clsx from "clsx";
import { FC, ReactNode } from "react";
import { Text } from "./styled";

const variantStyles = {
  1: "text-3xl",
  2: "text-2xl",
  3: "text-xl",
};

export const Heading: FC<{
  children: ReactNode;
  level?: keyof typeof variantStyles;
}> = ({ children, level = 1 }) => {
  return (
    <Text
      // @ts-expect-error RNfW
      accessibilityRole="paragraph"
      accessibilityLevel={level}
      className={clsx(
        "mb-4 mt-2 text-gray-900 dark:text-gray-200 dark:antialiased",
        variantStyles[level]
      )}
    >
      {children}
    </Text>
  );
};
