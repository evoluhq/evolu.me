import { String1000 } from "evolu";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { KeyboardEvent, memo, useRef } from "react";
import { useIntl } from "react-intl";
import { TextInput } from "react-native";
import { useMutation } from "../lib/db";
import { domFocus, domId } from "../lib/domId";
import { localStorageKeys } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { EvoluTextInput } from "./EvoluTextInput";
import { View } from "./styled";

const newEvoluTitleAtom = atomWithStorage(localStorageKeys.newEvoluTitle, "");

export const CreateEvolu = memo(function CreateEvolu() {
  const intl = useIntl();
  const [title, setTitle] = useAtom(newEvoluTitleAtom);
  const { mutate } = useMutation();
  const inputRef = useRef<TextInput>(null);

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
            inputRef.current?.scrollIntoView({ block: "nearest" });
          }, 1);
        });
      })
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowUp":
        domFocus("lastEvoluInput")(e);
        break;
      case "ArrowDown":
        domFocus("firstFilterButton")(e);
        break;
    }
  };

  return (
    <View className="flex-row">
      <View className="w-6" />
      <EvoluTextInput
        nativeID={domId.createEvoluInput}
        value={title}
        ref={inputRef}
        onChangeText={setTitle}
        onSubmitEditing={handleSubmitEditing}
        hasUnsavedChange={title.length > 0}
        onKeyDown={handleKeyDown}
        accessibilityLabel={intl.formatMessage({
          defaultMessage: "Write a new Evolu item",
          id: "3DQarp",
        })}
      />
    </View>
  );
});
