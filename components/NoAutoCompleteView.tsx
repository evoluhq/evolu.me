import { FC } from "react";
import { Platform, View, ViewProps } from "react-native";

/**
 * Chrome suggests passwords even for plain text input fields for some reasons.
 * Suggested fix works only on form element for same reason as well.
 * https://developer.mozilla.org/en-US/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion
 */
export const NoAutoCompleteView: FC<ViewProps> = (props) => {
  return (
    <View
      {...props}
      {...(Platform.select({
        web: {
          accessibilityRole: "form",
          accessibilityAutoComplete: "off",
        },
        // RNfW.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any)}
    />
  );
};
