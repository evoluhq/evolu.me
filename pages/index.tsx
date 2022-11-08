import { ClientOnly } from "../components/ClientOnly";
import { CreateEvolu } from "../components/CreateEvolu";
import { EvoluList } from "../components/EvoluList";
import { EvoluFilter } from "../components/EvoluNav";
import { Layout } from "../components/Layout";
import { PageTitle } from "../components/PageTitle";
import { View } from "../components/styled";

const Index = () => {
  return (
    <>
      <PageTitle />
      <Layout waitForData footer={<EvoluFilter />}>
        <View
          className="py-[132px]" // 3x44
        >
          <ClientOnly>
            <EvoluList />
            <CreateEvolu />
          </ClientOnly>
        </View>
      </Layout>
    </>
  );
};

export default Index;
