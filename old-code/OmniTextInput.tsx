import { String1000 } from "evolu";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useIntl } from "react-intl";
import { TextInput } from "react-native";
import { useMutation } from "../lib/db";
import { useKeyNavigation } from "../lib/hooks/useKeyNavigation";
import { localStorageKeys } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { uniqueId } from "../lib/uniqueId";
import { EvoluTextInput } from "./EvoluTextInput";
import { View } from "../components/styled";

const newNodeTitleAtom = atomWithStorage(localStorageKeys.newNodeTitle, "");

export const OmniTextInput = () => {
  const intl = useIntl();
  const [title, setTitle] = useAtom(newNodeTitleAtom);
  const { mutate } = useMutation();

  const handleSubmitEditing = () => {
    pipe(
      String1000.safeParse(title),
      safeParseToEither,
      either.match(constVoid, (title) => {
        mutate("node", { title });
        setTitle("");
      })
    );
  };

  const keyNavigation = useKeyNavigation<TextInput>({
    keys: {
      ArrowUp: { id: uniqueId.lastNodeLink },
      ArrowDown: { id: uniqueId.mainNavButton },
      // Backspace: [
      //   { id: uniqueId.lastNodeLink },
      //   ({ currentTarget: { selectionStart, selectionEnd } }) =>
      //     selectionStart === 0 && selectionEnd === 0,
      // ],
    },
  });

  return (
    <View className="flex-1 px-2">
      <EvoluTextInput
        nativeID={uniqueId.createNodeInput}
        value={title}
        {...keyNavigation}
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
};
