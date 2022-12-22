import clsx from "clsx";
import { FC } from "react";
import { useIntl } from "react-intl";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Link } from "../components/Link";
import { View } from "../components/styled";
import { Text } from "../components/Text";
import { focusClassName, focusClassNames } from "../lib/focusClassNames";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
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
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  EditorState,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
} from "lexical";
import { useRouter } from "next/router";
import { MutableRefObject, useCallback, useEffect, useRef } from "react";
import { useMutation } from "../lib/db";
import { FocusClassName } from "../lib/focusClassNames";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { useScrollRestoration } from "../lib/hooks/useScrollRestoration";
import { localStorageKeys } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";

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
        KEY_ESCAPE_COMMAND,
        () => {
          router.back();
          return true;
        },
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
      )
    );
  }, [editor, editorTextRef, onSubmit, router]);

  return null;
};

const Toolbar: FC<{ x: number }> = ({ x }) => {
  const intl = useIntl();

  const keys = {
    ArrowLeft: "previousX",
    ArrowRight: "nextX",
    ArrowUp: focusClassName("createNodeInput"),
  } as const;

  const allKeyNav = useKeyNavigation({ x: 0, keys });
  const searchKeyNav = useKeyNavigation({ x: 1, keys });

  return (
    <View className="flex-row justify-evenly">
      <Link href="/">
        <Text
          as="link"
          p
          className={clsx(focusClassNames.allLink, "my-1 py-1")}
          {...allKeyNav}
          // @ts-expect-error RNfW
          focusable={x === 0}
        >
          {intl.formatMessage({
            defaultMessage: "All",
            id: "zQvVDJ",
          })}
        </Text>
      </Link>
      <Button {...searchKeyNav} focusable={x === 1}>
        <Text as="button">
          {intl.formatMessage({
            defaultMessage: "Search",
            id: "xmcVZ0",
          })}
        </Text>
      </Button>
    </View>
  );
};

const useAddNodeMutation = (): ((value: NonEmptyString1000) => void) => {
  const { mutate } = useMutation();
  const ids = useLocationHashNodeIds();
  const { requestScrollToEndAnimated } = useScrollRestoration();

  return useCallback(
    (value) => {
      const { id } = mutate("node", { title: value }, () => {
        requestScrollToEndAnimated();
      });
      ids.forEach((relatedId) => {
        // The edge direction doesn't matter.
        // We sort IDs to have always the same edge.
        const sortedTuple = [id, relatedId].sort();
        mutate("edge", { a: sortedTuple[0], b: sortedTuple[1] });
      });
    },
    [ids, mutate, requestScrollToEndAnimated]
  );
};

export const NodeEditor: FC = () => {
  const editorTextRef = useRef<string>();

  const handleChange = useCallback((state: EditorState) => {
    state.read(() => {
      const value = $getRoot().getTextContent().trim();
      editorTextRef.current = value;
      localStorage.setItem(localStorageKeys.newNodeTitle, value);
    });
  }, []);

  const addNodeMutation = useAddNodeMutation();
  const handleSubmit = (value: NonEmptyString1000) => {
    addNodeMutation(value);
  };

  return (
    <Container className="pb-0">
      <Text className="rounded bg-gray-100 px-3 py-2 dark:bg-gray-900">
        <LexicalComposer
          initialConfig={{
            namespace: "EvoluMe",
            onError(error) {
              // eslint-disable-next-line no-console
              console.log(error);
            },
            theme: {
              root: "outline-none",
            },
            editorState: () => {
              pipe(
                localStorage.getItem(localStorageKeys.newNodeTitle),
                option.fromNullable,
                option.map($createTextNode),
                option.map((text) => $createParagraphNode().append(text)),
                option.match(constVoid, (p) => {
                  $getRoot().append(p);
                })
              );
            },
          }}
        >
          <PlainTextPlugin
            contentEditable={
              <ContentEditable className={focusClassNames.createNodeInput} />
            }
            placeholder={<></>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <KeyHandlerPlugin
            onSubmit={handleSubmit}
            editorTextRef={editorTextRef}
          />
        </LexicalComposer>
      </Text>
      <KeyboardNavigationProvider maxX={1}>
        {({ x }) => <Toolbar x={x} />}
      </KeyboardNavigationProvider>
    </Container>
  );
};
