import { FC, ReactNode } from "react";
import { View } from "./styled";

export const Container: FC<{ children: ReactNode }> = ({ children }) => {
  return <View className="mx-auto w-full max-w-[500px] p-3">{children}</View>;
};
