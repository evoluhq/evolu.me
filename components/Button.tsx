import { StyleXStyles, create } from "@stylexjs/stylex";
import { forwardRef } from "react";
import { GestureResponderEvent, Pressable } from "react-native";
import {
  atDistance,
  colors,
  consts,
  fontSizes,
  spacing,
  transitions,
} from "../lib/Tokens.stylex";
import { RNfW } from "../lib/Types";
import { Text } from "./Text";

// Different baselines need different buttons.
export type ButtonVariant = "app" | "appSmall" | "web" | "webBig";

export type ButtonRef = HTMLElement;

export interface ButtonProps {
  title: string | JSX.Element;
  variant?: ButtonVariant;

  style?: StyleXStyles;
  titleStyle?: StyleXStyles;
  titleHoverStyle?: StyleXStyles;
  titlePressedStyle?: StyleXStyles;

  onPress?: (e: GestureResponderEvent) => void;
  tabIndex?: -1 | 0;
  disabled?: boolean;
  selected?: boolean;
}

export const Button = forwardRef<ButtonRef, ButtonProps>(function Button(
  {
    title,
    variant,
    style,
    titleStyle,
    titleHoverStyle,
    titlePressedStyle,
    onPress,
    tabIndex,
    disabled,
    selected,
  },
  ref,
) {
  return (
    <Pressable
      ref={ref as RNfW}
      style={[styles.pressable as RNfW, style as RNfW]}
      role="button"
      onPress={onPress}
      // @ts-expect-error RNfW......
      tabIndex={tabIndex}
      disabled={disabled}
    >
      {({
        /**
         * We can't use CSS pseudo-classes because they are unreliable for touch
         * and keyboard. For focus, we need focus-visible.
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hovered,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        pressed,
      }) => (
        <Text
          style={[
            styles.title,
            styles[variant || "app"],
            titleStyle != null && titleStyle,
            hovered && [
              styles.titleHover,
              titleHoverStyle != null && titleHoverStyle,
            ],
            (pressed || selected === true) && [
              styles.titlePressed,
              titlePressedStyle != null && titlePressedStyle,
            ],
            disabled === true && styles.titleDisabled,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
});

const styles = create({
  pressable: {
    // "styling at a distance"
    // https://github.com/facebook/stylex/issues/250#issuecomment-1868392679
    [atDistance.buttonBackgroundColor]: {
      default: null,
      ":focus-visible": colors.hoverAndFocusBackground,
    },
    alignItems: "center",
    outline: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    minWidth: consts.minimalHit,
  },
  title: {
    textAlign: "center",
    borderRadius: spacing.xxxs,
    color: colors.primary,
    transition: transitions.color,
    backgroundColor: atDistance.buttonBackgroundColor,
  },
  titleHover: {
    backgroundColor: colors.hoverAndFocusBackground,
    color: colors.primary,
  },
  titlePressed: {
    backgroundColor: `color-mix(in srgb, ${colors.hoverAndFocusBackground}, black 10%)`,
    color: colors.primary,
  },
  titleDisabled: {
    color: colors.secondary,
  },
  // Variants
  app: {
    fontSize: fontSizes.step0,
    lineHeight: spacing.s as unknown as number,
    paddingInline: spacing.xxs,
    marginBlock: spacing.xxxs,
    paddingBlock: spacing.xxxs,
  },
  appSmall: {
    color: colors.secondary,
    fontSize: fontSizes.step_2,
    fontWeight: 600,
    lineHeight: spacing.xxs as unknown as number,
    padding: spacing.xxxs,
    // outline: `solid 1px ${colors.inactive}`,
    // outlineOffset: -1,
  },
  web: {
    fontSize: fontSizes.step0,
    lineHeight: spacing.s as unknown as number,
    marginInline: spacing.xxxs,
    paddingInline: spacing.xxs,
    marginBlock: spacing.xxs,
    paddingBlock: spacing.xxs,
  },
  webBig: {
    fontSize: fontSizes.step1,
    lineHeight: spacing.s as unknown as number,
    marginInline: spacing.xxxs,
    paddingInline: spacing.xs,
    marginBlock: spacing.xxs,
    paddingBlock: spacing.xxs,
  },
});
