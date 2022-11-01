import { String1000 } from "evolu";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { memo, useRef } from "react";
import { TextInput } from "react-native";
import { useMutation } from "../lib/db";
import { localStorageKeys } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { EvoluTextInput } from "./EvoluTextInput";
import { View } from "./styled";

const newEvoluTitleAtom = atomWithStorage(localStorageKeys.newEvoluTitle, "");

export const CreateEvolu = memo(function CreateEvolu() {
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

  return (
    <View className="flex-row">
      <View className="w-6" />
      <EvoluTextInput
        value={title}
        ref={inputRef}
        onChangeText={setTitle}
        onSubmitEditing={handleSubmitEditing}
        hasUnsavedChange={title.length > 0}
      />
    </View>
  );
});
