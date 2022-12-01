import { AccessibilityState, Platform } from "react-native";

// https://necolas.github.io/react-native-web/docs/accessibility/
// https://github.com/react-native-community/discussions-and-proposals/pull/496

// Because of RNfW types.
/* eslint-disable @typescript-eslint/no-explicit-any */

/** A helper for universal accessibility.  */
export const accessibility = {
  heading: (
    level: 1 | 2 | 3
  ): {
    accessibilityRole: "header";
  } =>
    Platform.select({
      web: {
        accessibilityRole: "heading",
        accessibilityLevel: level,
      } as any,
      default: {
        accessibilityRole: "header",
      },
    }),

  paragraph: (): Record<string, never> =>
    Platform.select({
      web: {
        accessibilityRole: "paragraph",
      } as any,
      default: {},
    }),

  // accessibilityState not working in RNfW, props must be used.
  state: (
    accessibilityState: AccessibilityState
  ): { accessibilityState: AccessibilityState } =>
    Platform.select({
      web: {
        accessibilityBusy: accessibilityState.busy,
        accessibilityChecked: accessibilityState.checked,
        accessibilityDisabled: accessibilityState.disabled,
        accessibilityExpanded: accessibilityState.expanded,
        accessibilitySelected: accessibilityState.selected,
      } as any,
      default: { accessibilityState },
    }),
};
