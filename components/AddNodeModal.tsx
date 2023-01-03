import clsx from "clsx";
import { NonEmptyString1000 } from "evolu";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useAtom } from "jotai";
import { FC, memo, useLayoutEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { Modal } from "react-native";
import useEvent from "react-use-event-hook";
import { appBg } from "../lib/appBg";
import { newNodeAtom } from "../lib/atoms";
import { createEdge, useMutation } from "../lib/db";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { safeParseToEither } from "../lib/safeParseToEither";
import { Button } from "./Button";
import { CloseButtonLayer } from "./CloseButtonLayer";
import { Container } from "./Container";
import { Editor, EditorRef } from "./Editor";
import { ScrollView, View } from "./styled";
import { Text } from "./Text";

const AddNodeModalButton: FC<{ onPress: IO<void>; title: string }> = ({
  onPress,
  title,
}) => {
  return (
    <Button onPress={onPress} className="flex-1">
      <Text as="button">{title}</Text>
    </Button>
  );
};

const Buttons = memo<{ onAdd: IO<void>; onRequestClose: IO<void> }>(
  function Buttons({ onAdd, onRequestClose }) {
    const intl = useIntl();

    return (
      <View className="flex-row justify-evenly">
        <AddNodeModalButton
          onPress={onAdd}
          title={intl.formatMessage({
            defaultMessage: "Add",
            id: "2/2yg+",
          })}
        />
        <AddNodeModalButton
          onPress={onRequestClose}
          title={intl.formatMessage({
            defaultMessage: "Close",
            id: "rbrahO",
          })}
        />
      </View>
    );
  }
);

export const AddNodeModal: FC<{
  onRequestClose: IO<void>;
}> = ({ onRequestClose }) => {
  const editorRef = useRef<EditorRef>(null);
  const [newNode, setNewNode] = useAtom(newNodeAtom);

  const handleEditorChange = useEvent((value: string) => {
    setNewNode((a) => ({ ...a, title: value }));
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const bottomBarRef = useRef<View>(null);

  // No useSyncExternalStore because it does not interact with React.
  useLayoutEffect(() => {
    const scrollView = scrollViewRef.current;
    const bottomBar = bottomBarRef.current;
    const viewport = visualViewport;
    if (!scrollView || !bottomBar || !viewport) return;

    const onChange = () => {
      // https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport#simulating_position_device-fixed
      const offsetX = viewport.offsetLeft;
      const offsetY =
        viewport.height -
        // @ts-expect-error RNfW
        scrollView.getBoundingClientRect().height +
        viewport.offsetTop;
      // @ts-expect-error RNfW
      bottomBar.style.transform = `translate(${offsetX}px,${offsetY}px) scale(${
        1 / viewport.scale
      })`;
    };

    onChange();

    visualViewport?.addEventListener("scroll", onChange);
    visualViewport?.addEventListener("resize", onChange);
    return () => {
      visualViewport?.removeEventListener("scroll", onChange);
      visualViewport?.removeEventListener("resize", onChange);
    };
  }, []);

  const { mutate } = useMutation();
  const ids = useLocationHashNodeIds();

  const handleButtonsAdd = useEvent(() => {
    pipe(
      // TODO: "too long text, it's x length, max is..."
      NonEmptyString1000.safeParse(newNode.title),
      safeParseToEither,
      either.match(constVoid, (title) => {
        setNewNode((a) => ({ ...a, title: "" }));
        const { id } = mutate("node", { title });
        ids.forEach((adjacentId) => {
          mutate("edge", createEdge(id, adjacentId));
        });
        onRequestClose();
      })
    );
  });

  return (
    <Modal transparent onRequestClose={onRequestClose} visible>
      <ScrollView
        ref={scrollViewRef}
        // className={appBg}
        // className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {/* pb-11 is bottomBar height */}
        <Container className={clsx("mt-12 flex-1 pb-11", appBg)}>
          {/* <Ring className=""> */}
          {/* <Text className="h-7" /> */}
          <Editor
            ref={editorRef}
            initialValue={newNode.title}
            onChange={handleEditorChange}
          />
          {/* <Text className="h-7" /> */}
          {/* </Ring> */}
        </Container>
        <CloseButtonLayer withBg onPress={onRequestClose} />
      </ScrollView>
      <View ref={bottomBarRef} className="fixed inset-x-0 bottom-0">
        <Container className={clsx("py-0", appBg)}>
          <Buttons onAdd={handleButtonsAdd} onRequestClose={onRequestClose} />
        </Container>
      </View>
    </Modal>
  );
};
