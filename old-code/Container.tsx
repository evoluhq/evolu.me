import clsx from "clsx";
import { FC, ReactNode } from "react";
import { View } from "../components/styled";

export const Container: FC<{
  children: ReactNode;
  flex1?: boolean;
}> = ({ children, flex1 }) => {
  return (
    <View
      className={clsx("mx-auto w-full max-w-[500px] px-3", flex1 && "flex-1")}
    >
      {children}
    </View>
  );
};
