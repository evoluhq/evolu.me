import clsx from "clsx";
import { useAtom } from "jotai";
import { RESET } from "jotai/utils";
import { memo, useEffect } from "react";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import { useEditNodeAtom } from "../lib/atoms";
import { NodeId, NodeMarkdown } from "../lib/db";
import { Button } from "./Button";
import { Editor } from "./Editor";
import { View } from "./styled";
import { Text } from "./Text";

export const NodeEditor = memo<{
  row: { id: NodeId; md: NodeMarkdown };
}>(function NodeEditor({ row: { id, md } }) {
  const intl = useIntl();
  const [editNode, setEditNode] = useAtom(useEditNodeAtom(id, md));

  const handleEditorChange = (value: string) => {
    setEditNode((a) => ({ ...a, md: value }));
  };

  const hasChange = editNode.md !== editNode.originalMd;
  const shouldReset = useEvent(() => editNode.md === editNode.originalMd);

  useEffect(() => {
    return () => {
      // Ensure dynamically created atomWithStorage is deleted from LocalStorage.
      if (shouldReset()) setEditNode(RESET);
    };
  }, [setEditNode, shouldReset]);

  return (
    <View className={clsx(!hasChange && "pb-11")}>
      <Editor
        initialValue={editNode.md}
        onChange={handleEditorChange}
        hasChange={hasChange}
      />
      {hasChange && (
        <View className="flex-row justify-center">
          <Button>
            <Text as="button">
              {intl.formatMessage({ defaultMessage: "Save", id: "jvo0vs" })}
            </Text>
          </Button>
        </View>
      )}
    </View>
  );
});
