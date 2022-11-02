import clsx from "clsx";
import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { ClientOnly } from "../components/ClientOnly";
import { CreateEvolu } from "../components/CreateEvolu";
import { EvoluFilter } from "../components/EvoluFilter";
import { EvoluList } from "../components/EvoluList";
import { PageTitle } from "../components/PageTitle";
import { ScrollView, View } from "../components/styled";

const ContentContainer: FC<{
  children: ReactNode;
  isLoaded: boolean;
  textClassName?: string;
}> = ({ children, isLoaded, textClassName }) => {
  return (
    <View
      className={clsx("mx-auto w-full max-w-[500px] p-4", textClassName)}
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
            <ContentContainer
              isLoaded={dataAreLoaded}
              // Ensure that my thumb reaches EvoluListItem.
              textClassName="py-[30vh]"
            >
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
