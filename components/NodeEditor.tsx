import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { memo, useEffect, useMemo, useState } from "react";
import useEvent from "react-use-event-hook";
import { NodeId, NodeMarkdown, useMutation } from "../lib/db";
import { createLocalStorageKey } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { Editor } from "./Editor";
import { View } from "./styled";

export const NodeEditor = memo<{
  row: { id: NodeId; md: NodeMarkdown };
}>(function NodeEditor({ row: { id, md } }) {
  const createAtom = (md: NodeMarkdown) =>
    atomWithStorage<{
      id: NodeId;
      md: string;
      originalMd: NodeMarkdown;
    }>(createLocalStorageKey(`editNodeAtom${id}:`), {
      id,
      md,
      originalMd: md,
    });

  const [atom, setAtom] = useState(() => createAtom(md));
  const [editNode, setEditNode] = useAtom(atom);

  const handleEditorChange = useEvent((value: string) => {
    if (editNode.md === value) return;
    setEditNode((a) => ({ ...a, md: value }));
  });

  const mdToSave = useMemo(
    () => pipe(NodeMarkdown.safeParse(editNode.md), safeParseToEither),
    [editNode.md]
  );

  const hasChange = editNode.md !== editNode.originalMd;

  const { mutate } = useMutation();

  const onBlurOrUnmount = useEvent(() => {
    if (!hasChange) {
      setEditNode(RESET);
      return;
    }
    pipe(
      mdToSave,
      either.match(constVoid, (md) => {
        mutate("node", { id, md });
        setEditNode(RESET);
        setAtom(createAtom(md));
      })
    );
  });

  useEffect(() => {
    return onBlurOrUnmount;
  }, [onBlurOrUnmount]);

  return (
    <View className="pb-11">
      <Editor
        initialValue={editNode.md}
        onChange={handleEditorChange}
        state={hasChange ? "error" : undefined}
        onBlur={onBlurOrUnmount}
      />
    </View>
  );
});
