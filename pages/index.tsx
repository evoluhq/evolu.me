import { FC } from "react";
import { useIntl } from "react-intl";
import { AdjacentNodes } from "../components/AdjacentNodes";
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
    <Container className="absolute inset-x-0 bottom-0 pb-0" backdrop>
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
        <Text as="button">
          {intl.formatMessage({
            defaultMessage: "Search",
            id: "xmcVZ0",
          })}
        </Text>
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
