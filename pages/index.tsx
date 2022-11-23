import { ClientOnly } from "../components/ClientOnly";
import { EvoluList } from "../components/EvoluList";
import { Layout } from "../components/Layout";
import { OmniTextInput } from "../components/OmniTextInput";
import { PageTitle } from "../components/PageTitle";
import { View } from "../components/styled";

const Index = () => {
  return (
    <>
      <PageTitle />
      <Layout
        // waitForData
        footer={
          <ClientOnly>
            <OmniTextInput />
          </ClientOnly>
        }
      >
        <View
          // A space for scrolling.
          className="py-[132px]" // 3x44
        >
          <ClientOnly>
            <EvoluList />
          </ClientOnly>
        </View>
      </Layout>
    </>
  );
};

export default Index;
