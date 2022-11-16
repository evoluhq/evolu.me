import { forwardRef } from "react";
import { PressableProps, View as RnView } from "react-native";
import { Pressable } from "./styled";

export type ButtonProps = PressableProps;

export const Button = forwardRef<RnView, ButtonProps>(function Button(
  props,
  ref
) {
  return (
    <Pressable
      accessibilityRole="button"
      ref={ref}
      {...props}
      className="group focus:outline-none active:brightness-95 dark:active:brightness-90"
    />
  );
});
