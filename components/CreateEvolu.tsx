import { String1000 } from "evolu";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { useMutation } from "../lib/db";
import { localStorageKeys } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { EvoluTextInput } from "./EvoluTextInput";

const newEvoluTitleAtom = atomWithStorage(localStorageKeys.newEvoluTitle, "");

export const CreateEvolu = () => {
  const [title, setTitle] = useAtom(newEvoluTitleAtom);
  const { mutate } = useMutation();

  const handleSubmitEditing = () => {
    pipe(
      String1000.safeParse(title),
      safeParseToEither,
      either.match(constVoid, (title) => {
        mutate("evolu", { title });
        setTitle(RESET);
      })
    );
  };

  return (
    <EvoluTextInput
      value={title}
      onChangeText={setTitle}
      onSubmitEditing={handleSubmitEditing}
    />
  );
};
