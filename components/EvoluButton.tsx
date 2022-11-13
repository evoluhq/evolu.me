import { IO } from "fp-ts/IO";
import { forwardRef, KeyboardEvent, useContext, useState } from "react";
import { useIntl } from "react-intl";
import { View as RnView } from "react-native";
import { EvoluId, useMutation } from "../lib/db";
import { setSafeTimeout } from "../lib/setSafeTimeout";
import { KeyboardNavigationContext } from "../lib/useKeyNavigation";
import { EvoluDialog } from "./EvoluDialog";
import { Pressable, View } from "./styled";

export interface EvoluButton {
  focusable: boolean;
  onFocus: IO<void>;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  title: string;
  id: EvoluId;
}

export const EvoluButton = forwardRef<RnView, EvoluButton>(function EvoluButton(
  { focusable, onFocus, onKeyDown, title, id },
  ref
) {
  const intl = useIntl();
  const { mutate } = useMutation();
  const { move } = useContext(KeyboardNavigationContext);
  const [dialogIsVisible, setDialogIsVisible] = useState(false);

  const handleDialogDelete = () => {
    mutate("evolu", { id, isDeleted: true }, () => {
      setSafeTimeout(() => move("current"));
    });
  };

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
          onDelete={handleDialogDelete}
        />
      )}
    </>
  );
});
