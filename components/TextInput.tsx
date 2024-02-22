import { StyleXStyles, create, props } from "@stylexjs/stylex";
import { forwardRef } from "react";
import { colors, fontSizes, fonts } from "../lib/Tokens.stylex";

export type TextInputProps = Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "style"
> & {
  style?: StyleXStyles;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ style, ...rest }, ref) {
    return <input ref={ref} {...rest} {...props([styles.base, style])} />;
  },
);

const styles = create({
  base: {
    color: colors.primary,
    backgroundColor: colors.background,
    borderStyle: "none",
    fontSize: fontSizes.step0,
    fontFamily: fonts.sans,
    outline: "none",
  },
});
