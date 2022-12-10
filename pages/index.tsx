import { FC } from "react";
import { useIntl } from "react-intl";
import { AdjacentNodes } from "../components/AdjacentNodes";
import { Button } from "../components/Button";
import { ClientOnly } from "../components/ClientOnly";
import { Container } from "../components/Container";
import { Layout } from "../components/Layout";
import { Link } from "../components/Link";
import { NodeEditor } from "../components/NodeEditor";
import { NodeList } from "../components/NodeList";
import { View } from "../components/styled";
import { Text } from "../components/Text";
import { useAddNodeMutation } from "../lib/hooks/useAddNodeMutation";

// TODO: Persist new state into local storage.
// const newNodeTitleAtom = atomWithStorage(localStorageKeys.newNodeTitle, "");
// const [title, setTitle] = useAtom(newNodeTitleAtom);

const Footer: FC = () => {
  const intl = useIntl();
  const addNodeMutation = useAddNodeMutation();

  return (
    <Container className="pb-0">
      <NodeEditor onSubmit={addNodeMutation} />
      <View className="flex-row justify-evenly">
        <Link href="/">
          <Text as="link" p>
            {intl.formatMessage({
              defaultMessage: "All",
              id: "zQvVDJ",
            })}
          </Text>
        </Link>
        <Button>
          <Text as="button">
            {intl.formatMessage({
              defaultMessage: "Search",
              id: "xmcVZ0",
            })}
          </Text>
        </Button>
      </View>
    </Container>
  );
};

const Index = () => {
  return (
    <Layout
      waitForData
      title={
        <ClientOnly>
          <AdjacentNodes />
        </ClientOnly>
      }
      centerContent
      footer={
        <ClientOnly>
          <Footer />
        </ClientOnly>
      }
    >
      <ClientOnly>
        <NodeList />
      </ClientOnly>
    </Layout>
  );
};

export default Index;
