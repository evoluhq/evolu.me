import { StyleXStyles, create, props } from "@stylexjs/stylex";
import NextLink from "next/link";
import { ReactNode, forwardRef } from "react";
import { Pressable, PressableStateCallbackType } from "react-native";
import { colors, fontSizes, fonts, spacing } from "../lib/Tokens.stylex";
import { RNfW } from "../lib/Types";

export interface LinkProps {
  href: string;
  children: ReactNode | ((state: PressableStateCallbackType) => ReactNode);
  pressableStyle?: StyleXStyles;
  pressableHoverStyle?: StyleXStyles;
  style?: StyleXStyles;
  hoverStyle?: StyleXStyles;
  scroll?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
  tabIndex?: -1 | 0;
  // TODO: onPressIn for prefetching to mitigate RNfW 50ms delay.
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    href,
    children,
    pressableStyle,
    pressableHoverStyle,
    style,
    hoverStyle,
    scroll = true,
    onClick,
    ...rest
  },
  ref,
) {
  return (
    /**
     * We must use Pressable for mouse hover interaction to prevent sticky hover
     * effects on touch devices. There is no other solution. It can be solved
     * only with JavaScript; CSS isn't enough. Check Tailwind issues.
     */
    <Pressable
      // https://github.com/facebook/stylex/issues/280
      style={({ hovered }) =>
        [
          styles.pressable,
          pressableStyle,
          hovered && pressableHoverStyle,
        ] as RNfW
      }
      // @ts-expect-error RNfW
      tabIndex={-1}
    >
      {(state) => {
        const mergedStyles = props(
          styles.link,
          style,
          (state.pressed || state.hovered) && [styles.hover, hoverStyle],
        );

        if (href.startsWith("https://"))
          return (
            <a {...mergedStyles} {...rest} href={href} target="_blank">
              {typeof children !== "function" ? children : children(state)}
            </a>
          );

        return (
          <NextLink
            {...mergedStyles}
            {...rest}
            href={href}
            scroll={scroll}
            onClick={() => {
              // dispatchManualAutosave();
              if (onClick) onClick();
            }}
            ref={ref}
          >
            {typeof children !== "function" ? children : children(state)}
          </NextLink>
        );
      }}
    </Pressable>
  );
});

const styles = create({
  pressable: {
    outline: "none",
  },
  link: {
    color: colors.primary,
    fontSize: fontSizes.step0,
    fontFamily: fonts.sans,
    lineHeight: spacing.m,
    outline: "none",
    textDecoration: {
      default: "none",
      ":focus-visible": "underline",
    },
  },
  hover: {
    textDecoration: "underline",
  },
});
