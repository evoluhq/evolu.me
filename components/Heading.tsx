import clsx from "clsx";
import { FC, ReactNode } from "react";
import { Text } from "./styled";

export const Heading: FC<{ children: ReactNode; level?: 1 | 2 | 3 }> = ({
  children,
  level = 1,
}) => {
  return (
    <Text
      // @ts-expect-error RNfW
      accessibilityRole="paragraph"
      accessibilityLevel={level}
      className={clsx(
        "text-gray-900 dark:text-gray-200 dark:antialiased",
        level === 3 ? "text-lg" : level === 2 ? "text-xl" : "text-3xl"
      )}
    >
      {children}
    </Text>
  );
};
