import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { ClientOnly } from "../components/ClientOnly";
import { CreateEvolu } from "../components/CreateEvolu";
import { EvoluFilter } from "../components/EvoluFilter";
import { EvoluList } from "../components/EvoluList";
import { PageTitle } from "../components/PageTitle";

const ContentContainer: FC<{ children: ReactNode; isLoaded: boolean }> = ({
  children,
  isLoaded,
}) => {
  return (
    <View
      className="mx-auto w-full max-w-[500px] p-4"
      style={!isLoaded && { display: "none" }}
    >
      {children}
    </View>
  );
};

const Index = () => {
  // React Suspense would be better, but we are not there yet.
  const dataAreLoaded = useEvoluFirstDataAreLoaded();

  return (
    <>
      <PageTitle />
      <View className="flex-1 bg-white dark:bg-black">
        <ClientOnly>
          <ScrollView className="flex-1" centerContent>
            <ContentContainer isLoaded={dataAreLoaded}>
              <EvoluList />
              <CreateEvolu />
            </ContentContainer>
          </ScrollView>
          <ContentContainer isLoaded={dataAreLoaded}>
            <EvoluFilter />
          </ContentContainer>
        </ClientOnly>
      </View>
    </>
  );
};

export default Index;
