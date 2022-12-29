import clsx from "clsx";
import {
  FC,
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
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
import { useAtom, useAtomValue, useSetAtom } from "jotai";
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
import { useEffect } from "react";
import { flushSync } from "react-dom";
import useEvent from "react-use-event-hook";
import { editNodeAtom, editNodeHasChangeAtom, newNodeAtom } from "../lib/atoms";
import { createEdge, useMutation } from "../lib/db";
import { FocusClassName } from "../lib/focusClassNames";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { useScrollRestoration } from "../lib/hooks/useScrollRestoration";
import { safeParseToEither } from "../lib/safeParseToEither";

const KeyHandlerPlugin = memo<{
  onKeyEnter: IO<void>;
}>(function KeyHandlerPlugin({ onKeyEnter }) {
  const [editor] = useLexicalComposerContext();
  const router = useRouter();

  const onCollapsedRangeSelectionAndTextStart =
    (...className: FocusClassName[]) =>
    (e: KeyboardEvent): boolean =>
      pipe(
        $getSelection(),
        option.fromNullable,
        option.filter($isRangeSelection),
        option.filter((s) => s.isCollapsed()),
        option.filter((s) => s.anchor.offset === 0),
        option.match(constFalse, () => {
          e.preventDefault();
          focusClassName(...className)();
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
            e.preventDefault();
            onKeyEnter();
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
        onCollapsedRangeSelectionAndTextStart("lastNodeItemLink"),
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        onCollapsedRangeSelectionAndTextStart("allLink", "saveNodeButton"),
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, onKeyEnter, router]);

  return null;
});

const useButtonKeyNavigation = (x: number) =>
  useKeyNavigation({
    x,
    keys: {
      ArrowLeft: "previousX",
      ArrowRight: "nextX",
      ArrowUp: focusClassName("createNodeInput"),
    },
  });

const NewNodeMenuButtons: FC<{ x: number }> = ({ x }) => {
  const intl = useIntl();

  const allKeyNav = useButtonKeyNavigation(0);
  const searchKeyNav = useButtonKeyNavigation(1);
  const ids = useLocationHashNodeIds();

  return (
    <View className="flex-row justify-evenly">
      <Link href="/">
        <Text
          as="link"
          p
          transparent={ids.length > 0}
          className={clsx(focusClassNames.allLink, "my-1 py-1")}
          {...allKeyNav}
          // @ts-expect-error RNfW
          focusable={x === 0}
        >
          {intl.formatMessage({ defaultMessage: "All", id: "zQvVDJ" })}
        </Text>
      </Link>
      <Button {...searchKeyNav} focusable={x === 1}>
        <Text as="button">
          {intl.formatMessage({ defaultMessage: "Search", id: "xmcVZ0" })}
        </Text>
      </Button>
    </View>
  );
};

const NewNodeMenu: FC = () => {
  return (
    <KeyboardNavigationProvider maxX={1}>
      {({ x }) => <NewNodeMenuButtons x={x} />}
    </KeyboardNavigationProvider>
  );
};

const useCancelEditModeAndFocusAllLink = () => {
  const setEditNode = useSetAtom(editNodeAtom);

  return () => {
    // So we can focus immediately after.
    flushSync(() => {
      setEditNode(null);
    });
    focusClassName("allLink")();
  };
};

const EditNodeMenuButtons: FC<{ x: number; onSavePress: IO<void> }> = ({
  x,
  onSavePress,
}) => {
  const intl = useIntl();

  const saveKeyNav = useButtonKeyNavigation(0);
  const cancelKeyNav = useButtonKeyNavigation(1);

  const hasChange = useAtomValue(editNodeHasChangeAtom);

  return (
    <View className="flex-row justify-evenly">
      <Button
        {...saveKeyNav}
        focusable={x === 0}
        className={focusClassNames.saveNodeButton}
        disabled={!hasChange}
        onPress={onSavePress}
      >
        <Text as="button" transparent={!hasChange}>
          {intl.formatMessage({ defaultMessage: "Save", id: "jvo0vs" })}
        </Text>
      </Button>
      <Button
        {...cancelKeyNav}
        focusable={x === 1}
        onPress={useCancelEditModeAndFocusAllLink()}
      >
        <Text as="button">
          {intl.formatMessage({ defaultMessage: "Cancel", id: "47FYwb" })}
        </Text>
      </Button>
    </View>
  );
};

const EditNodeMenu = memo<{ onSavePress: IO<void> }>(function EditNodeMenu({
  onSavePress,
}) {
  return (
    <KeyboardNavigationProvider maxX={1}>
      {({ x }) => <EditNodeMenuButtons x={x} onSavePress={onSavePress} />}
    </KeyboardNavigationProvider>
  );
});

interface NodeEditorPluginsRef {
  save: IO<void>;
}

const NodeEditorPlugins = forwardRef<NodeEditorPluginsRef>(
  function NodeEditorPlugins(props, ref) {
    useImperativeHandle(ref, () => ({ save }));

    const [editor] = useLexicalComposerContext();

    const { mutate } = useMutation();
    const ids = useLocationHashNodeIds();
    const { requestScrollToEndAnimated } = useScrollRestoration();

    const [newNode, setNewNode] = useAtom(newNodeAtom);
    const [editNode, setEditNode] = useAtom(editNodeAtom);

    const handleChange = useEvent((state: EditorState) => {
      state.read(() => {
        const title = $getRoot().getTextContent().trim();
        if (editNode) setEditNode((v) => (v ? { ...v, title } : null));
        else setNewNode((a) => ({ ...a, title }));
      });
    });

    const cancelEditModeAndFocusAllLink = useCancelEditModeAndFocusAllLink();

    const save = useEvent(() =>
      pipe(
        // TODO: Alert "too long text, it's x length, max is..."
        NonEmptyString1000.safeParse(editNode ? editNode.title : newNode.title),
        safeParseToEither,
        either.match(constVoid, (title) => {
          editor.update(() => {
            $getRoot().clear();
          });

          const { id } = mutate(
            "node",
            { title, id: editNode ? editNode.id : undefined },
            () => {
              requestScrollToEndAnimated();
            }
          );

          if (editNode) cancelEditModeAndFocusAllLink();
          else
            ids.forEach((adjacentId) => {
              mutate("edge", createEdge(id, adjacentId));
            });
        })
      )
    );

    return useMemo(
      () => (
        <>
          <OnChangePlugin onChange={handleChange} />
          <KeyHandlerPlugin onKeyEnter={save} />
        </>
      ),
      [handleChange, save]
    );
  }
);

export const NodeEditor: FC = () => {
  const nodeEditorPluginsRef = useRef<NodeEditorPluginsRef>(null);

  const lexicalComposerChildren = useMemo(
    () => (
      <>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable className={focusClassNames.createNodeInput} />
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <NodeEditorPlugins ref={nodeEditorPluginsRef} />
      </>
    ),
    []
  );

  const handleSavePress = useCallback(() => {
    nodeEditorPluginsRef.current?.save();
  }, []);

  const newNode = useAtomValue(newNodeAtom);
  const editNode = useAtomValue(editNodeAtom);

  return (
    <Container className="pb-0">
      <Text className="rounded bg-gray-100 px-3 py-2 dark:bg-gray-900">
        <LexicalComposer
          key={editNode?.id}
          initialConfig={{
            namespace: "EvoluMe",
            onError(error) {
              // eslint-disable-next-line no-console
              console.log(error);
            },
            theme: { root: "outline-none" },
            editorState: () => {
              const value = editNode ? editNode.title : newNode.title;
              if (value)
                $getRoot().append(
                  $createParagraphNode().append($createTextNode(value))
                );
            },
          }}
        >
          {lexicalComposerChildren}
        </LexicalComposer>
      </Text>
      {editNode ? (
        <EditNodeMenu onSavePress={handleSavePress} />
      ) : (
        <NewNodeMenu />
      )}
    </Container>
  );
};
