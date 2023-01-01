import { useIntl } from "react-intl";
import { ClientOnly } from "../components/ClientOnly";
import { Container } from "../components/Container";
import { Layout } from "../components/Layout";
import { NodeFilter } from "../components/NodeFilter";
import { NodeList } from "../components/NodeList";
import { TabBar } from "../components/TabBar";

const Index = () => {
  const intl = useIntl();

  return (
    <Layout
      waitForData
      title={intl.formatMessage({
        defaultMessage: "Keep your thoughts organized",
        id: "2tGGKj",
      })}
      centerContent
      header={
        <ClientOnly>
          <NodeFilter />
        </ClientOnly>
      }
      footer={
        <ClientOnly>
          <Container className="pb-0">
            <TabBar />
          </Container>
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
