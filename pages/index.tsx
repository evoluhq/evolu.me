import { FC } from "react";
import { useIntl } from "react-intl";
import { ClientOnly } from "../components/ClientOnly";
import { Container } from "../components/Container";
import { Editor } from "../components/Editor";
import { Layout } from "../components/Layout";
import { NodeList } from "../components/NodeList";
import { View } from "../components/styled";
import { Text } from "../components/Text";

const Footer: FC = () => {
  const intl = useIntl();

  return (
    <Container className="absolute inset-x-0 bottom-0" backdrop>
      <Editor />
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
