import { useIntl } from "react-intl";
import { ClientOnly } from "../components/ClientOnly";
import { Layout } from "../components/Layout";
import { NodeEditor } from "../components/NodeEditor";
import { NodeFilter } from "../components/NodeFilter";
import { NodeList } from "../components/NodeList";

const Index = () => {
  const intl = useIntl();

  return (
    <Layout
      waitForData
      title={intl.formatMessage({
        defaultMessage: "Mind mapping app that is private and works offline",
        id: "R9gWu2",
      })}
      centerContent
      header={
        <ClientOnly>
          <NodeFilter />
        </ClientOnly>
      }
      footer={
        <ClientOnly>
          <NodeEditor />
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
