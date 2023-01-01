import { NonEmptyString1000 } from "evolu";
import { either } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import { Button } from "../components/Button";
import { ClientOnly } from "../components/ClientOnly";
import { Container } from "../components/Container";
import { Editor, EditorRef } from "../components/Editor";
import { Layout } from "../components/Layout";
import { NodeFilter } from "../components/NodeFilter";
import { TabBar } from "../components/TabBar";
import { Text } from "../components/Text";
import { newNodeAtom } from "../lib/atoms";
import { createEdge, useMutation } from "../lib/db";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";
import { safeParseToEither } from "../lib/safeParseToEither";

const AddEditor = () => {
  const intl = useIntl();
  const [newNode, setNewNode] = useAtom(newNodeAtom);
  const router = useRouter();
  const editorRef = useRef<EditorRef>(null);
  const { mutate } = useMutation();
  const ids = useLocationHashNodeIds();

  const handleEditorChange = useEvent((value: string) => {
    setNewNode((a) => ({ ...a, title: value }));
  });

  const handleAddPress = useEvent(() => {
    pipe(
      // TODO: Alert "too long text, it's x length, max is..."
      NonEmptyString1000.safeParse(newNode.title),
      safeParseToEither,
      either.match(constVoid, (title) => {
        setNewNode((a) => ({ ...a, title: "" }));
        const { id } = mutate("node", { title });
        ids.forEach((adjacentId) => {
          mutate("edge", createEdge(id, adjacentId));
        });
        pipe(ids, nodeIdsToLocationHash, (s) => {
          router.push(`/#${s}`);
        });
      })
    );
  });

  return (
    <>
      <Editor
        initialValue={newNode.title}
        onChange={handleEditorChange}
        ref={editorRef}
      />
      <Text className="h-7" />
      <Button onPress={handleAddPress}>
        <Text as="roundedButton" className="text-center">
          {intl.formatMessage({ defaultMessage: "Add", id: "2/2yg+" })}
        </Text>
      </Button>
    </>
  );
};

const Add = () => {
  const intl = useIntl();

  return (
    <Layout
      title={intl.formatMessage({
        defaultMessage: "Add",
        id: "2/2yg+",
      })}
      header={
        <ClientOnly>
          <NodeFilter />
        </ClientOnly>
      }
      footer={
        <Container className="pb-0">
          <TabBar />
        </Container>
      }
    >
      <ClientOnly>
        <AddEditor />
      </ClientOnly>
    </Layout>
  );
};

export default Add;
