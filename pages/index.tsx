import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { View } from "react-native";
import { ClientOnly } from "../components/ClientOnly";
import { CreateEvolu } from "../components/CreateEvolu";
import { EvoluFilter } from "../components/EvoluFilter";
import { EvoluList } from "../components/EvoluList";
import { PageTitle } from "../components/PageTitle";

const Container: FC<{ children: ReactNode; isHidden: boolean }> = ({
  children,
  isHidden,
}) => {
  return (
    <View
      className="mx-auto w-full max-w-[500px] flex-1 px-4 py-12"
      style={isHidden && { display: "none" }}
    >
      {children}
    </View>
  );
};

const Index = () => {
  const dataAreLoaded = useEvoluFirstDataAreLoaded();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <PageTitle />
      <ClientOnly>
        <Container isHidden={!dataAreLoaded}>
          <View className="flex-1 justify-center gap-y-4">
            <EvoluList />
            <CreateEvolu />
          </View>
          <EvoluFilter />
        </Container>
      </ClientOnly>
    </View>
  );
};

export default Index;
