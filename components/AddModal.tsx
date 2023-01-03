import { IO } from "fp-ts/IO";
import { useAtom } from "jotai";
import { FC, memo, useLayoutEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { Modal } from "react-native";
import useEvent from "react-use-event-hook";
import { newNodeAtom } from "../lib/atoms";
import { Button } from "./Button";
import { Container } from "./Container";
import { Editor, EditorRef } from "./Editor";
import { ScrollView, View } from "./styled";
import { Text } from "./Text";

const AddModalButton: FC<{ onPress: IO<void>; title: string }> = ({
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
        <AddModalButton
          onPress={onAdd}
          title={intl.formatMessage({
            defaultMessage: "Add",
            id: "2/2yg+",
          })}
        />
        <AddModalButton
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

export const AddModal: FC<{
  onRequestClose: IO<void>;
}> = ({ onRequestClose }) => {
  const editorRef = useRef<EditorRef>(null);
  const [newNode, setNewNode] = useAtom(newNodeAtom);

  const handleEditorChange = useEvent((value: string) => {
    setNewNode((a) => ({ ...a, title: value }));
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const bottomBarRef = useRef<View>(null);

  // absolute inset-x-0 bottom-0
  // "mx-auto w-full max-w-[500px] p-3"
  useLayoutEffect(() => {
    const layoutViewport = scrollViewRef.current;
    const bottomBar = bottomBarRef.current;
    const viewport = visualViewport;
    if (!layoutViewport || !bottomBar || !viewport) return;

    const onChange = () => {
      const offsetX = viewport.offsetLeft;
      const offsetY =
        viewport.height -
        // @ts-expect-error RNfW
        layoutViewport.getBoundingClientRect().height +
        viewport.offsetTop;
      // You could also do this by setting style.left and style.top if you
      // use width: 100% instead.
      // @ts-expect-error RNfW
      bottomBar.style.transform =
        "translate(" +
        offsetX +
        "px," +
        offsetY +
        "px) " +
        "scale(" +
        1 / viewport.scale +
        ")";
    };

    onChange();

    visualViewport?.addEventListener("scroll", onChange);
    visualViewport?.addEventListener("resize", onChange);
    return () => {
      visualViewport?.removeEventListener("scroll", onChange);
      visualViewport?.removeEventListener("resize", onChange);
    };
  });

  const handleButtonsAdd = useEvent(() => {
    // pipe(
    //   // TODO: Alert "too long text, it's x length, max is..."
    //   NonEmptyString1000.safeParse(newNode.title),
    //   safeParseToEither,
    //   either.match(constVoid, (title) => {
    //     setNewNode((a) => ({ ...a, title: "" }));
    //     const { id } = mutate("node", { title });
    //     ids.forEach((adjacentId) => {
    //       mutate("edge", createEdge(id, adjacentId));
    //     });
    //     pipe(ids, nodeIdsToLocationHash, (s) => {
    //       router.push(`/#${s}`);
    //     });
    //   })
    // );
  });

  return (
    <Modal transparent onRequestClose={onRequestClose} visible>
      <ScrollView
        ref={scrollViewRef}
        className="bg-white dark:bg-black"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Container className="flex-1">
          <Text className="h-7" />
          <Editor
            ref={editorRef}
            initialValue={newNode.title}
            onChange={handleEditorChange}
          />
          <Text className="h-7" />
        </Container>
      </ScrollView>
      <View ref={bottomBarRef} className="fixed inset-x-0 bottom-0">
        <Container className="py-0">
          <Buttons onAdd={handleButtonsAdd} onRequestClose={onRequestClose} />
        </Container>
      </View>
    </Modal>
  );
};
