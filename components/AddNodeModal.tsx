import clsx from "clsx";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useAtom } from "jotai";
import { atomWithStorage, RESET } from "jotai/utils";
import { FC, memo, useLayoutEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { Modal } from "react-native";
import useEvent from "react-use-event-hook";
import { createEdge, NodeId, NodeMarkdown, useMutation } from "../lib/db";
import { getFirstLineAlwaysVisible } from "../lib/getFirstLineAlwaysVisible";
import { createLocalStorageKey } from "../lib/localStorage";
import { safeParseToEither } from "../lib/safeParseToEither";
import { bg } from "../styles";
import { Button } from "./Button";
import { CloseButtonLayer } from "./CloseButtonLayer";
import { Container } from "./Container";
import { Editor } from "./Editor";
import { ScrollView, View } from "./styled";
import { Text } from "./Text";

const newNodeAtom = atomWithStorage<{
  md: string;
}>(createLocalStorageKey("newNodeAtom"), {
  md: "",
});

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
  ids: readonly NodeId[];
  rows: readonly { id: NodeId; md: NodeMarkdown }[];
  onRequestClose: IO<void>;
}> = ({ ids, rows, onRequestClose }) => {
  const intl = useIntl();
  const [newNode, setNewNode] = useAtom(newNodeAtom);

  const handleEditorChange = useEvent((value: string) => {
    setNewNode((a) => ({ ...a, md: value }));
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const bottomBarRef = useRef<View>(null);

  // TODO: Refactor into a hook.
  // No useSyncExternalStore because it does not interact with React.
  // https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport#simulating_position_device-fixed
  useLayoutEffect(() => {
    const scrollView = scrollViewRef.current;
    const bottomBar = bottomBarRef.current;
    const viewport = visualViewport;
    if (!scrollView || !bottomBar || !viewport) return;

    const onChange = () => {
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

  const handleButtonsAdd = useEvent(() => {
    pipe(
      NodeMarkdown.safeParse(newNode.md),
      safeParseToEither,
      either.match(constVoid, (md) => {
        const { id } = mutate("node", { md }, () => {
          setNewNode(RESET);
          onRequestClose();
        });
        ids.forEach((adjacentId) => {
          mutate("edge", createEdge(id, adjacentId));
        });
      })
    );
  });

  return (
    <Modal transparent onRequestClose={onRequestClose} visible>
      <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexGrow: 1 }}>
        {/* pb-11 is bottomBar height */}
        <Container className={clsx("flex-1 pb-11", bg)}>
          {/* the same vertical position as other pages */}
          <View className="flex-row gap-x-4 pt-2 pb-5">
            {rows.map((row) => (
              <Text className="" key={row.id} numberOfLines={1}>
                {getFirstLineAlwaysVisible(row.md)}
              </Text>
            ))}
          </View>
          <Editor initialValue={newNode.md} onChange={handleEditorChange} />
          {/* <Text className="h-7" /> */}
          {!newNode.md.length && (
            <View className="my-2">
              <Text size="sm" p transparent>
                {/* <Balancer> */}
                {intl.formatMessage({
                  defaultMessage: `Add anything: note, to-do, project, person, place, thing, thought…
                    
The beauty of EvoluMe is that you can connect anything with anything.`,
                  id: "EcRJWC",
                })}
                {/* </Balancer> */}
              </Text>
            </View>
          )}
        </Container>
        <CloseButtonLayer withBg onPress={onRequestClose} />
      </ScrollView>
      <View ref={bottomBarRef} className="fixed inset-x-0 bottom-0">
        <Container className={clsx("py-0", bg)}>
          <Buttons onAdd={handleButtonsAdd} onRequestClose={onRequestClose} />
        </Container>
      </View>
    </Modal>
  );
};
