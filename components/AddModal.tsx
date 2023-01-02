import { IO } from "fp-ts/IO";
import { useAtom } from "jotai";
import { FC, useRef } from "react";
import { useIntl } from "react-intl";
import { Modal } from "react-native";
import useEvent from "react-use-event-hook";
import { newNodeAtom } from "../lib/atoms";
import { Button } from "./Button";
import { Container } from "./Container";
import { Editor, EditorRef } from "./Editor";
import { View } from "./styled";
import { Text } from "./Text";

export const AddModal: FC<{
  onRequestClose: IO<void>;
}> = ({ onRequestClose }) => {
  const intl = useIntl();
  const editorRef = useRef<EditorRef>(null);
  const [newNode, setNewNode] = useAtom(newNodeAtom);

  const handleEditorChange = useEvent((value: string) => {
    setNewNode((a) => ({ ...a, title: value }));
  });

  const handleAddPress = useEvent(() => {
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

  const handleClosePress = () => {
    onRequestClose();
  };

  return (
    <Modal transparent onRequestClose={onRequestClose} visible>
      <Container className="flex-1 bg-white dark:bg-black">
        <Text className="h-7" />
        <Editor
          ref={editorRef}
          initialValue={newNode.title}
          onChange={handleEditorChange}
        />
        <Text className="h-7" />
        <View className="flex-row justify-evenly">
          <Button onPress={handleAddPress}>
            <Text as="roundedButton" className="text-center">
              {intl.formatMessage({ defaultMessage: "Add", id: "2/2yg+" })}
            </Text>
          </Button>
          <Button onPress={handleClosePress}>
            <Text as="roundedButton" className="text-center">
              {intl.formatMessage({ defaultMessage: "Close", id: "rbrahO" })}
            </Text>
          </Button>
        </View>
      </Container>
    </Modal>
  );
};
