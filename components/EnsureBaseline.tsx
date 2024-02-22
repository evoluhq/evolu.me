import { StyleXStyles, create } from "@stylexjs/stylex";
import { memo } from "react";
import { Text } from "./Text";

/**
 * CSS baseline is defined by font size. This component forces texts with
 * smaller font sizes to have the same baseline as this component. It only works
 * for the app baseline and font size smaller than fontSizes.step0.
 */
export const EnsureBaseline = memo<{ style?: StyleXStyles }>(
  function EnsureBaseline({ style }) {
    return (
      <Text aria-hidden style={[styles.text, style != null && style]}>
        0
      </Text>
    );
  },
);

const styles = create({
  text: {
    visibility: "hidden",
    marginLeft: "-1ch",
  },
});
