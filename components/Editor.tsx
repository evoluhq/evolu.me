import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { StyleXStyles, create, props } from "@stylexjs/stylex";
import { Either } from "effect";
import {
  $createParagraphNode,
  $getRoot,
  COMMAND_PRIORITY_LOW,
  EditorState,
  KEY_ENTER_COMMAND,
  LexicalEditor,
} from "lexical";
import {
  FC,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Content, Root, contentFromEditorState } from "../lib/Lexical";
import { colors, fontSizes, fonts, spacing } from "../lib/Tokens.stylex";
import { EnsureBaseline } from "./EnsureBaseline";

// TODO: Check LexicalEditorRefPlugin.

export interface EditorRef extends ClearEditorPluginRef, FocusEditorPluginRef {}

export interface EditorProps {
  initialValue: Root;
  autoFocus?: boolean;
  isVisible?: boolean;
  onChange?: (content: Content) => void;
  onKeyEnter?: () => void;
  contentEditableStyle?: StyleXStyles;
  isApp?: boolean;
  noPlaceholder?: boolean;
}

export const Editor = memo(
  forwardRef<EditorRef, EditorProps>(function Editor(
    {
      initialValue,
      autoFocus,
      isVisible,
      onChange,
      onKeyEnter,
      contentEditableStyle,
      isApp,
      noPlaceholder,
    },
    ref,
  ) {
    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          clearEditorPluginRef.current?.clear();
        },
        focus: () => {
          focusEditorPluginRef.current?.focus();
        },
      }),
      [],
    );

    const handleChange = useCallback(
      (editorState: EditorState) => {
        Either.match(contentFromEditorState(editorState), {
          onLeft: () => {
            // eslint-disable-next-line no-console
            console.error(
              "Lexical generated unexpected EditorState. If that happens, it means Evolu Schema or Lexical Editor is wrong. Please open an issue on GitHub.",
              JSON.stringify(editorState.toJSON()),
            );
          },
          onRight: (content) => {
            if (onChange) onChange(content);
          },
        });
      },
      [onChange],
    );

    const clearEditorPluginRef = useRef<ClearEditorPluginRef>(null);
    const focusEditorPluginRef = useRef<FocusEditorPluginRef>(null);

    const initialConfig = useMemo(
      () => ({
        namespace: "Note",
        onError: (error: unknown) => {
          // eslint-disable-next-line no-console
          console.error(error);
        },
        theme: {
          ltr: "ltr",
          paragraph: props([
            themeStyles.paragraph,
            isApp && themeStyles.paragraphApp,
          ]).className as string,
        },
        editorState: (editorState: LexicalEditor) => {
          editorState.setEditorState(
            editorState.parseEditorState({ root: initialValue }),
          );
        },
        editable: onChange != null,
      }),
      [initialValue, isApp, onChange],
    );

    return (
      <LexicalComposer initialConfig={initialConfig}>
        <div {...props([styles.container, isApp && styles.containerApp])}>
          <EnsureBaseline style={styles.ensureBaseline} />
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                {...props([styles.contentEditable, contentEditableStyle])}
                // Text format getting lost when using suggestion/autocorrect on iOS
                // https://github.com/facebook/lexical/pull/5397
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                // Ensure the off-screen Editor instance is not navigable by the tab key.
                tabIndex={isVisible ? 0 : -1}
              />
            }
            placeholder={
              noPlaceholder !== true ? (
                <div {...props(styles.placeholder)}>Enter some text...</div>
              ) : null
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        {
          /**
           * If client-side performance more of a concern though, you can build
           * a separate "read-only" Lexical Editor which strips out any
           * unnecessary plugins which are used in editing (e.g.
           * OnChangePlugin).
           * https://github.com/facebook/lexical/discussions/2455#discussioncomment-2981557
           */
          onChange && (
            <>
              <OnChangePlugin onChange={handleChange} />
              <HistoryPlugin />
              <ClearEditorPlugin ref={clearEditorPluginRef} />
              {autoFocus && <AutoFocusPlugin />}
              {onKeyEnter && <OnKeyEnterPlugin onKeyEnter={onKeyEnter} />}
              <FocusEditorPlugin ref={focusEditorPluginRef} />
            </>
          )
        }
      </LexicalComposer>
    );
  }),
);

const styles = create({
  ensureBaseline: {
    lineHeight: spacing.l as unknown as number,
  },
  container: {
    position: "relative",
    display: "flex",
    flex: 1,
  },
  containerApp: {
    alignItems: "baseline",
  },
  contentEditable: {
    width: "100%",
    outline: "none",
  },
  placeholder: {
    fontSize: fontSizes.step0,
    lineHeight: spacing.l as unknown as number,
    fontFamily: fonts.sans,
    position: "absolute",
    userSelect: "none",
    WebkitUserSelect: "none",
    overflow: "hidden",
    top: 0,
    left: 0,
    pointerEvents: "none",
    color: colors.secondary,
    whiteSpace: "nowrap",
    backgroundColor: null,
  },
});

const themeStyles = create({
  paragraph: {
    // marginBottom: spacing.s,
    color: colors.primary,
    fontSize: fontSizes.step0,
    fontFamily: fonts.sans,
    lineHeight: spacing.m as unknown as number,
  },
  paragraphApp: {
    lineHeight: spacing.s as unknown as number,
  },
});

const OnChangePlugin: FC<{
  onChange: (editorState: EditorState) => void;
}> = ({ onChange }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
};

interface ClearEditorPluginRef {
  clear: () => void;
}

const ClearEditorPlugin = forwardRef<ClearEditorPluginRef>(
  function ClearEditorPlugin(props, ref) {
    const [editor] = useLexicalComposerContext();
    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          editor.update(() => {
            const p = $createParagraphNode();
            $getRoot().clear().append(p);
            // Select ensures the correct caret position.
            p.select();
          });
        },
      }),
      [editor],
    );
    return null;
  },
);

const OnKeyEnterPlugin: FC<{
  onKeyEnter: () => void;
}> = ({ onKeyEnter }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event: KeyboardEvent) => {
        event.preventDefault();
        onKeyEnter();
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, onKeyEnter]);
  return null;
};

interface FocusEditorPluginRef {
  focus: () => void;
}

const FocusEditorPlugin = forwardRef<FocusEditorPluginRef>(
  function FocusEditorPlugin(props, ref) {
    const [editor] = useLexicalComposerContext();
    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          editor.focus();
        },
      }),
      [editor],
    );
    return null;
  },
);
