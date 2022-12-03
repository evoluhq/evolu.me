import { NonEmptyString1000 } from "evolu";
import { FC, useCallback } from "react";
import { useIntl } from "react-intl";
import { ClientOnly } from "../components/ClientOnly";
import { Container } from "../components/Container";
import { Editor } from "../components/Editor";
import { Layout } from "../components/Layout";
import { NodeList } from "../components/NodeList";
import { View } from "../components/styled";
import { Text } from "../components/Text";

// TODO: Persist new state into local storage.
// const newNodeTitleAtom = atomWithStorage(localStorageKeys.newNodeTitle, "");
// const [title, setTitle] = useAtom(newNodeTitleAtom);

const Footer: FC = () => {
  const intl = useIntl();

  const handleSubmit = useCallback((value: NonEmptyString1000) => {
    // eslint-disable-next-line no-console
    console.log(value);
  }, []);

  return (
    <Container className="absolute inset-x-0 bottom-0 pb-0" backdrop>
      <Editor onSubmit={handleSubmit} />
      <View className="flex-row justify-evenly">
        <Text as="button">
          {intl.formatMessage({
            defaultMessage: "All",
            id: "zQvVDJ",
          })}
        </Text>
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
      // waitForData
      title=""
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
