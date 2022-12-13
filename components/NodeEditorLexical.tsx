import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { mergeRegister } from "@lexical/utils";
import { NonEmptyString1000 } from "evolu";
import { either, option } from "fp-ts";
import { constFalse, constVoid, flow, pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  EditorState,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
} from "lexical";
import { useRouter } from "next/router";
import {
  FC,
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  focusClassNames,
  focusClassName,
  FocusClassName,
} from "../lib/focusClassNames";
import { safeParseToEither } from "../lib/safeParseToEither";
import { Text } from "./Text";

const initialConfig: InitialConfigType = {
  namespace: "EvoluMe",
  onError(error) {
    // eslint-disable-next-line no-console
    console.log(error);
  },
  theme: {
    root: "outline-none",
  },
};

// This is weird but recommended. We have to store the state to a string first.
// https://lexical.dev/docs/concepts/editor-state#understanding-the-editor-state
const createInitialEditorState = (text: string): string => {
  return `{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"${text}","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
};

const KeyHandlerPlugin: FC<{
  onSubmit: (value: NonEmptyString1000) => void;
  editorTextRef: MutableRefObject<string | undefined>;
}> = ({ onSubmit, editorTextRef }) => {
  const [editor] = useLexicalComposerContext();
  const router = useRouter();

  const onCollapsedRangeSelection =
    (classNameOrCallback: FocusClassName | IO<void>) =>
    (e: KeyboardEvent): boolean =>
      pipe(
        $getSelection(),
        option.fromNullable,
        option.filter($isRangeSelection),
        option.filter((s) => s.isCollapsed()),
        option.filter((s) => s.anchor.offset === 0),
        option.match(constFalse, () => {
          e.preventDefault();
          if (typeof classNameOrCallback === "string")
            focusClassName(classNameOrCallback)();
          else classNameOrCallback();
          return true;
        })
      );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        flow(
          option.fromNullable,
          option.filter((e) => !e.shiftKey),
          option.match(constFalse, (e) => {
            // Lexical rich text plugin uses only preventDefault 🤷‍♂️
            // event.stopPropagation();
            // event.stopImmediatePropagation()
            e.preventDefault();

            pipe(
              NonEmptyString1000.safeParse(editorTextRef.current),
              safeParseToEither,
              // TODO: Alert "too long text, it's x length, max is y"
              either.match(constVoid, (value) => {
                // https://lexical.dev/docs/faq#how-do-i-clear-the-contents-of-the-editor
                editor.update(() => {
                  $getRoot().clear();
                });
                onSubmit(value);
              })
            );
            return true;
          })
        ),
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        onCollapsedRangeSelection("lastNodeItemLink"),
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        onCollapsedRangeSelection("allLink"),
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_LEFT_COMMAND,
        onCollapsedRangeSelection(() => {
          router.back();
        }),
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, editorTextRef, onSubmit, router]);

  return null;
};

export const NodeEditorLexical = memo<{
  onSubmit: (value: NonEmptyString1000) => void;
  initialValue?: string;
}>(function Editor({ onSubmit, initialValue }) {
  const editorTextRef = useRef<string>();

  const handleChange = useCallback((state: EditorState) => {
    state.read(() => {
      editorTextRef.current = $getRoot().getTextContent().trim();
    });
  }, []);

  return (
    <Text className="rounded bg-gray-100 px-3 py-2 dark:bg-gray-900">
      <LexicalComposer
        initialConfig={{
          ...initialConfig,
          editorState:
            initialValue != null
              ? createInitialEditorState(initialValue)
              : undefined,
        }}
      >
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              autoCapitalize={false}
              autoComplete={false}
              className={focusClassNames.createNodeInput}
            />
          }
          placeholder={<></>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={handleChange} />
        <HistoryPlugin />
        <KeyHandlerPlugin onSubmit={onSubmit} editorTextRef={editorTextRef} />
      </LexicalComposer>
    </Text>
  );
});
