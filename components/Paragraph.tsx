import { FC, ReactNode } from "react";
import { Text } from "./styled";

export const Paragraph: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Text
      // @ts-expect-error RNfW
      accessibilityRole="paragraph"
      className="mb-4 text-lg text-gray-900 dark:text-gray-200 dark:antialiased"
    >
      {children}
    </Text>
  );
};
