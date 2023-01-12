import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import { NodeId, NodeMarkdown, useMutation } from "../lib/db";
import { createLocalStorageKey } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { BlankButton } from "./BlankButton";
import { Editor } from "./Editor";
import { NodeEditorPopover } from "./NodeEditorPopover";
import { View } from "./styled";

export const NodeEditor = memo<{
  row: { id: NodeId; md: NodeMarkdown };
}>(
  function NodeEditor({ row: { id, md } }) {
    const intl = useIntl();

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

    const buttonRef = useRef<View | null>(null);
    const [popoverIsVisible, setPopoverIsVisible] = useState(false);

    return (
      // flex-col-reverse to improve key tab navigation (fewer steps)
      <View className="flex-col-reverse">
        <View className="flex-row justify-end">
          <BlankButton
            ref={buttonRef}
            type="circle"
            title={intl.formatMessage({
              defaultMessage: "Show context node actions",
              id: "TZaFhe",
            })}
            onPress={() => setPopoverIsVisible(true)}
            state={popoverIsVisible ? "active" : undefined}
          />
        </View>
        <Editor
          initialValue={editNode.md}
          onChange={handleEditorChange}
          state={hasChange ? "hasChange" : undefined}
          onBlur={onBlurOrUnmount}
        />
        {popoverIsVisible && (
          <NodeEditorPopover
            id={id}
            onRequestClose={() => setPopoverIsVisible(false)}
            ownerRef={buttonRef}
          />
        )}
      </View>
    );
  },
  (prev, next) => prev.row.id === next.row.id && prev.row.md === next.row.md
);
