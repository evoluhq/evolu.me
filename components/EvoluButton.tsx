import { forwardRef, KeyboardEvent, useState } from "react";
import { useIntl } from "react-intl";
import { View as RnView } from "react-native";
import { EvoluId } from "../lib/db";
import { EvoluDialog } from "./EvoluDialog";
import { Pressable, View } from "./styled";

export interface EvoluButton {
  focusable: boolean;
  onFocus: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  title: string;
  id: EvoluId;
}

export const EvoluButton = forwardRef<RnView, EvoluButton>(function EvoluButton(
  { focusable, onFocus, onKeyDown, title, id },
  ref
) {
  const intl = useIntl();
  const [dialogIsVisible, setDialogIsVisible] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={intl.formatMessage({
          defaultMessage: "Show detail",
          id: "z7JWlo",
        })}
        className="group -ml-2 w-9 items-center justify-center hover:brightness-90 focus:outline-none active:scale-90"
        onFocus={onFocus}
        // @ts-expect-error RNfW
        onKeyDown={onKeyDown}
        focusable={focusable}
        ref={ref}
        onPress={() => setDialogIsVisible(true)}
      >
        {/* for selection bg-gray-500 */}
        <View className="h-3 w-3 rounded-sm bg-gray-200 group-focus-visible:ring-2 dark:bg-gray-800" />
      </Pressable>
      {dialogIsVisible && (
        <EvoluDialog
          title={title}
          id={id}
          onRequestClose={() => setDialogIsVisible(false)}
        />
      )}
    </>
  );
});
