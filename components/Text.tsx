import { StyleXStyles, create } from "@stylexjs/stylex";
import { FC, ReactNode } from "react";
import { Text as RnText, TextProps as RnTextProps } from "react-native";
import { colors, fontSizes, fonts, spacing } from "../lib/Tokens.stylex";
import { RNfW } from "../lib/Types";

export interface TextProps {
  tag?: "h1" | "h2" | "h3" | "p";
  style?: StyleXStyles;
  children: ReactNode;
  "aria-hidden"?: boolean;
}

export const Text: FC<TextProps> = ({ tag, style, children, ...props }) => {
  return (
    <RnText
      {...props}
      style={[styles.base as RNfW, (tag && styles[tag]) as RNfW, style as RNfW]}
      {...tagToRnProps(tag)}
    >
      {children}
    </RnText>
  );
};

const styles = create({
  base: {
    fontFamily: fonts.sans,
    fontSize: fontSizes.step0,
    lineHeight: spacing.m,
    color: colors.primary,
  },
  h1: {
    fontSize: fontSizes.step3,
    lineHeight: spacing.xl,
    textWrap: "balance",
  },
  h2: {
    fontSize: fontSizes.step2,
    lineHeight: spacing.xl,
    textWrap: "balance",
  },
  h3: {
    fontSize: fontSizes.step1,
    lineHeight: spacing.m,
    textWrap: "balance",
  },
  p: {},
});

const tagToRnProps = (tag: TextProps["tag"]): RnTextProps => {
  switch (tag) {
    case "h1":
      return { role: "heading" };
    case "h2":
      return { role: "heading", "aria-level": 2 } as RnTextProps;
    case "h3":
      return { role: "heading", "aria-level": 3 } as RnTextProps;
    case "p":
      return { role: "paragraph" as RnTextProps["role"] };
    case undefined:
      return {};
  }
};
