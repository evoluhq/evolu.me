import { String1000 } from "evolu";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useEffect, useRef } from "react";
import { TextInput } from "react-native";
import { useMutation } from "../lib/db";
import { localStorageKeys } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { EvoluTextInput } from "./EvoluTextInput";

const newEvoluTitleAtom = atomWithStorage(localStorageKeys.newEvoluTitle, "");

export const CreateEvolu = () => {
  const [title, setTitle] = useAtom(newEvoluTitleAtom);
  const { mutate } = useMutation();
  const inputRef = useRef<TextInput>(null);

  // scrollIntoView in handleSubmitEditing is too soon.
  useEffect(() => {
    // @ts-expect-error Types
    if (title === "") inputRef.current?.scrollIntoView({ block: "nearest" });
  }, [title]);

  const handleSubmitEditing = () => {
    pipe(
      String1000.safeParse(title),
      safeParseToEither,
      either.match(constVoid, (title) => {
        mutate("evolu", { title }, () => {
          setTitle("");
        });
      })
    );
  };

  return (
    <EvoluTextInput
      value={title}
      ref={inputRef}
      onChangeText={setTitle}
      onSubmitEditing={handleSubmitEditing}
      hasUnsavedChange={title.length > 0}
    />
  );
};
