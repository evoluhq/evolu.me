import { memo } from "react";
import { NodeId, NodeMarkdown } from "../lib/db";
import { Editor } from "./Editor";
import { View } from "./styled";

export const NodeEditor = memo<{
  row: { id: NodeId; md: NodeMarkdown };
}>(function NodeEditor({ row: { md } }) {
  const handleEditorChange = () => {
    //
  };

  return (
    <View className="mb-4">
      <Editor initialValue={md} onChange={handleEditorChange} />
    </View>
  );
});
