import clsx from "clsx";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { memo, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import { NodeId, NodeMarkdown, useMutation } from "../lib/db";
import { createLocalStorageKey } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { Button } from "./Button";
import { Editor } from "./Editor";
import { View } from "./styled";
import { Text } from "./Text";

export const NodeEditor = memo<{
  row: { id: NodeId; md: NodeMarkdown };
}>(function NodeEditor({ row: { id, md } }) {
  const intl = useIntl();
  const [atom] = useState(() =>
    atomWithStorage<{
      id: NodeId;
      md: string;
      originalMd: NodeMarkdown;
    }>(createLocalStorageKey(`editNodeAtom${id}:`), {
      id,
      md,
      originalMd: md,
    })
  );
  const [editNode, setEditNode] = useAtom(atom);

  const handleEditorChange = (value: string) => {
    setEditNode((a) => ({ ...a, md: value }));
  };

  const hasChange = editNode.md !== editNode.originalMd;

  const deleteDynamicallyCreatedAtomFromLocalStorage = useEvent(() => {
    if (!hasChange) setEditNode(RESET);
  });

  useEffect(
    () => deleteDynamicallyCreatedAtomFromLocalStorage,
    [deleteDynamicallyCreatedAtomFromLocalStorage]
  );

  const { mutate } = useMutation();

  const handleSavePress = useEvent(() => {
    pipe(
      NodeMarkdown.safeParse(editNode.md),
      safeParseToEither,
      either.match(constVoid, (md) => {
        setEditNode((a) => ({ ...a, originalMd: md }));
        mutate("node", { id, md });
      })
    );
  });

  return (
    <View className={clsx(!hasChange && "pb-11")}>
      <Editor
        initialValue={editNode.md}
        onChange={handleEditorChange}
        hasChange={hasChange}
      />
      {hasChange && (
        <View className="flex-row justify-center">
          <Button onPress={handleSavePress}>
            <Text as="button">
              {intl.formatMessage({ defaultMessage: "Save", id: "jvo0vs" })}
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
});
