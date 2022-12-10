import { String1000 } from "evolu";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { memo } from "react";
import { useIntl } from "react-intl";
import { View } from "../components/styled";
import { useMutation } from "../lib/db";
import { useKeyNavigation } from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { localStorageKeys } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { uniqueId } from "../lib/uniqueId";
import { EvoluTextInput } from "./EvoluTextInput";
import { setSafeTimeout } from "./setSafeTimeout";

const newNodeTitleAtom = atomWithStorage(localStorageKeys.newNodeTitle, "");

export const CreateEvolu = memo(function CreateEvolu() {
  const intl = useIntl();
  const [title, setTitle] = useAtom(newNodeTitleAtom);
  const { mutate } = useMutation();
  const ids = useLocationHashNodeIds();

  const inputKeyNavigation = useKeyNavigation({
    keys: {
      ArrowUp: { id: uniqueId.lastNodeLink },
      ArrowDown: { id: uniqueId.firstNodeFilterItem },
      // Backspace: [
      //   { id: uniqueId.lastNodeLink },
      //   ({ currentTarget: { selectionStart, selectionEnd } }) =>
      //     selectionStart === 0 && selectionEnd === 0,
      // ],
    },
  });

  const handleSubmitEditing = () => {
    pipe(
      String1000.safeParse(title),
      safeParseToEither,
      either.match(constVoid, () => {
        const { id } = mutate("node", {}, () => {
          setTitle("");
          setSafeTimeout(() => {
            // @ts-expect-error RNfW
            inputKeyNavigation.ref.current?.scrollIntoView({
              block: "nearest",
            });
          });
        });
        ids.forEach((relatedId) => {
          // The edge direction doesn't matter.
          // We sort IDs to have always the same edge.
          const sortedTuple = [id, relatedId].sort();
          mutate("edge", { a: sortedTuple[0], b: sortedTuple[1] });
        });
      })
    );
  };

  return (
    <View className="flex-row">
      <View className="w-7" />
      <EvoluTextInput
        nativeID={uniqueId.createNodeInput}
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
