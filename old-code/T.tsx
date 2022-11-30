import clsx from "clsx";
import { IO } from "fp-ts/IO";
import { forwardRef } from "react";
import { AccessibilityRole, Text as RnText, TextProps } from "react-native";
import { Text } from "../components/styled";

type Variants = "t" | "p" | "a" | "tb" | "bb" | "h1" | "h2" | "h3";

export type TProps = Omit<TextProps, "accessibilityLevel"> & {
  /**
   * `t` = text
   * `p` = paragraph
   * `a` = a
   * `tb` = text button
   * `bb` = big button
   * `h1` = etc.
   */
  v?: Variants;
  customClassName?: string | false;
  // Supported by RNfW but not by RN types.
  focusable?: boolean;
  onClick?: IO<void>;
};

// RNfW
/* eslint-disable @typescript-eslint/no-explicit-any */
const accessibilityRole: Record<Variants, AccessibilityRole> = {
  t: "text",
  p: "paragraph" as any,
  a: "link",
  tb: "" as any, // It's wrapped by Button.
  bb: "" as any, // It's wrapped by Button.
  h1: "heading" as any,
  h2: "heading" as any,
  h3: "heading" as any,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const variants: Record<Variants | "default", string> = {
  default: "text-lg text-gray-900 dark:text-gray-200 dark:antialiased",
  t: "",
  p: "mb-4",
  a: "rounded py-2 px-3 focus:outline-none hocus:underline",
  tb: "rounded p-2 focus:outline-none hocus:bg-gray-200 group-hocus:bg-gray-200 dark:group-hocus:bg-gray-900 dark:hocus:bg-gray-900",
  bb: "rounded bg-gray-200 p-2 group-hocus:bg-gray-300 dark:bg-gray-800 dark:group-hocus:bg-gray-900",
  h1: "mb-4 mt-2 text-3xl",
  h2: "mb-4 mt-2 text-2xl",
  h3: "mb-4 mt-2 text-xl",
};

/**
 * A text component for all texts.
 */
export const T = forwardRef<RnText, TProps>(function T(
  { v = "t", customClassName, ...props },
  ref
) {
  return (
    <Text
      accessibilityRole={accessibilityRole[v]}
      {...(v.startsWith("h") && { accessibilityLevel: Number(v.slice(1)) })}
      selectable={v !== "tb" && v !== "bb"}
      {...props}
      ref={ref}
      className={clsx(variants.default, variants[v], customClassName)}
    />
  );
});
