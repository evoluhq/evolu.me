import { FC, ReactNode } from "react";
import { View } from "./styled";

export const Ring: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <View className="rounded bg-white ring-1 ring-gray-300 dark:bg-black dark:ring-gray-800">
      {children}
    </View>
  );
};
