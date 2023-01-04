import { NonEmptyString1000 } from "evolu";
import { memo } from "react";
import { NodeId } from "../lib/db";
// import { Editor } from "./Editor";
// import { View } from "./styled";

export const NodeEditor = memo<{
  row: { id: NodeId; title: NonEmptyString1000 };
}>(function NodeEditor() {
  //   const handleEditorChange = () => {
  //     //
  //   };

  return null;

  //   return (
  //     <View className="mb-4">
  //       <Editor initialValue="recepty" onChange={handleEditorChange} />
  //     </View>
  //   );
});
