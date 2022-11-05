import { String1000 } from "evolu";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { memo } from "react";
import { useIntl } from "react-intl";
import { TextInput } from "react-native";
import { useMutation } from "../lib/db";
import { localStorageKeys } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { uniqueId } from "../lib/uniqueId";
import { useKeyNavigation } from "../lib/useKeyNavigation";
import { EvoluTextInput } from "./EvoluTextInput";
import { View } from "./styled";

const newEvoluTitleAtom = atomWithStorage(localStorageKeys.newEvoluTitle, "");

export const CreateEvolu = memo(function CreateEvolu() {
  const intl = useIntl();
  const [title, setTitle] = useAtom(newEvoluTitleAtom);
  const { mutate } = useMutation();

  const inputKeyNavigation = useKeyNavigation<TextInput>({
    keys: {
      ArrowUp: { id: uniqueId.lastEvoluInput },
      ArrowDown: { id: uniqueId.firstFilterButton },
      Backspace: [
        { id: uniqueId.lastEvoluInput },
        ({ currentTarget: { selectionStart, selectionEnd } }) =>
          selectionStart === 0 && selectionEnd === 0,
      ],
    },
  });

  const handleSubmitEditing = () => {
    pipe(
      String1000.safeParse(title),
      safeParseToEither,
      either.match(constVoid, (title) => {
        mutate("evolu", { title }, () => {
          setTitle("");
          // IDK why, but scrollIntoView must be called in the setTimeout.
          setTimeout(() => {
            // @ts-expect-error RNfW
            inputKeyNavigation.ref.current?.scrollIntoView({
              block: "nearest",
            });
          }, 10);
        });
      })
    );
  };

  return (
    <View className="flex-row">
      <View className="w-7" />
      <EvoluTextInput
        nativeID={uniqueId.createEvoluInput}
        value={title}
        {...inputKeyNavigation}
        onChangeText={setTitle}
        onSubmitEditing={handleSubmitEditing}
        hasUnsavedChange={title.length > 0}
        accessibilityLabel={intl.formatMessage({
          defaultMessage: "Write a new Evolu item",
          id: "3DQarp",
        })}
      />
    </View>
  );
});
