import { styled } from "nativewind";
import { Pressable, PressableProps } from "react-native";

export interface ButtonProps extends PressableProps {
  className?: string;
}

export const Button = styled(
  Pressable,
  "group focus:outline-none active:brightness-95 dark:active:brightness-90"
);
