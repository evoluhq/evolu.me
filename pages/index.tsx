import { useEffect } from "react";
import { ClientOnly } from "../components/ClientOnly";
import { Layout } from "../components/Layout";
import { NodeEditor } from "../components/NodeEditor";
import { NodeFilter } from "../components/NodeFilter";
import { NodeList } from "../components/NodeList";

const Index = () => {
  useEffect(() => {
    document.addEventListener("focusout", () => {
      alert("ffo");
    });
  }, []);

  return (
    <Layout
      waitForData
      title={
        <ClientOnly>
          <NodeFilter />
        </ClientOnly>
      }
      centerContent
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
