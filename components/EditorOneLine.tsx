import { create } from "@stylexjs/stylex";
import { FC } from "react";
import { Editor, EditorProps } from "./Editor";

export const EditorOneLine: FC<EditorProps> = ({
  contentEditableStyle,
  ...props
}) => {
  return (
    <Editor
      isApp
      contentEditableStyle={[
        styles.contentEditable,
        contentEditableStyle || null,
      ]}
      {...props}
    />
  );
};

const styles = create({
  contentEditable: {
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 1,
  },
});
