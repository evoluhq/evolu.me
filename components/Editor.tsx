import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { mergeRegister } from "@lexical/utils";
import clsx from "clsx";
import { pipe } from "fp-ts/function";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  EditorState,
  FOCUS_COMMAND,
  LexicalEditor,
} from "lexical";
import {
  FC,
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import useEvent from "react-use-event-hook";
import { focusIds } from "../lib/focusIds";
import { ring } from "../styles";
import { Text } from "./Text";

const RefPlugin: FC<{ editorRef: ForwardedRef<LexicalEditor> }> = ({
  editorRef,
}) => {
  const [editor] = useLexicalComposerContext();
  useImperativeHandle(editorRef, () => editor, [editor]);
  return null;
};

// https://stackoverflow.com/a/72212077/233902
const FocusBlurPlugin: FC<{
  onFocus?: () => void;
  onBlur?: () => void;
}> = ({ onFocus, onBlur }) => {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    if (onFocus && editor.getRootElement() === document.activeElement)
      onFocus();

    return mergeRegister(
      editor.registerCommand(
        FOCUS_COMMAND,
        () => {
          if (onFocus) onFocus();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        BLUR_COMMAND,
        () => {
          if (onBlur) onBlur();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, onBlur, onFocus]);

  return null;
};

interface EditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  state?: "hasChange";
}

export const Editor = forwardRef<LexicalEditor, EditorProps>(function Editor(
  { initialValue, onChange, onFocus, onBlur, state },
  ref
) {
  const handleChange = useEvent((state: EditorState) => {
    state.read(() => {
      pipe($getRoot().getTextContent(), onChange);
    });
  });

  return (
    <Text
      className={clsx(
        "rounded bg-gray-100 px-2 py-2 dark:bg-gray-900",
        state === "hasChange" && ring
      )}
    >
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
              // @ts-expect-error Wrong types.
              autoCorrect="off"
              spellCheck={false}
              id={focusIds.editorContentEditable}
            />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        {/* <AutoFocusPlugin defaultSelection="rootEnd" /> */}
        <RefPlugin editorRef={ref} />
        <FocusBlurPlugin onFocus={onFocus} onBlur={onBlur} />
      </LexicalComposer>
    </Text>
  );
});
