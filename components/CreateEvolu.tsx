import { NonEmptyString1000 } from "evolu";
import { useAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { useIntl } from "react-intl";
import { useMutation } from "../lib/db";
import { localStorageKeys } from "../lib/localStorage";
import { EvoluTextInput } from "./EvoluTextInput";

const newEvoluTitleAtom = atomWithStorage(localStorageKeys.newEvoluTitle, "");

export const CreateEvolu = () => {
  const intl = useIntl();
  const [text, setText] = useAtom(newEvoluTitleAtom);
  const { mutate } = useMutation();

  const handleSubmitEditing = () => {
    const result = NonEmptyString1000.safeParse(text);
    if (!result.success) return;
    mutate("evolu", { title: result.data });
    setText(RESET);
  };

  return (
    <EvoluTextInput
      value={text}
      onChangeText={setText}
      blurOnSubmit={false}
      onSubmitEditing={handleSubmitEditing}
      placeholder={intl.formatMessage({ defaultMessage: "So what?" })}
    />
  );
};
