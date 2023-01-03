import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
} from "lexical";
import { FC, ForwardedRef, forwardRef, useImperativeHandle } from "react";
import useEvent from "react-use-event-hook";
import { focusClassNames } from "../lib/focusClassNames";
import { Text } from "./Text";

const RefPlugin: FC<{ editorRef: ForwardedRef<EditorRef> }> = ({
  editorRef,
}) => {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(
    editorRef,
    () => {
      return {
        clear() {
          editor.update(() => {
            $getRoot().clear();
          });
        },
      };
    },
    [editor]
  );

  return null;
};

export interface EditorRef {
  clear: IO<void>;
}

export const Editor = forwardRef<
  EditorRef,
  {
    initialValue: string;
    onChange: (value: string) => void;
  }
>(function Editor({ initialValue, onChange }, ref) {
  const handleChange = useEvent((state: EditorState) => {
    state.read(() => {
      pipe($getRoot().getTextContent().trim(), onChange);
    });
  });

  return (
    <Text className="rounded bg-gray-100 px-3 py-2 dark:bg-gray-900">
      <LexicalComposer
        initialConfig={{
          namespace: "EvoluMe",
          onError(error) {
            // eslint-disable-next-line no-console
            console.log(error);
          },
          theme: { root: "outline-none" },
          editorState: () => {
            $getRoot().append(
              $createParagraphNode().append($createTextNode(initialValue))
            );
          },
        }}
      >
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              // @ts-expect-error Wrong types.
              autoCapitalize="none"
              className={focusClassNames.editorContentEditable}
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        {/* <AutoFocusPlugin defaultSelection="rootEnd" /> */}
        <RefPlugin editorRef={ref} />
      </LexicalComposer>
    </Text>
  );
});
