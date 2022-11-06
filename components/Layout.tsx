import clsx from "clsx";
import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { MainNav } from "./MainNav";
import { ScrollView, View } from "./styled";

const Container: FC<{ children: ReactNode }> = ({ children }) => {
  return <View className="mx-auto w-full max-w-[500px] px-3">{children}</View>;
};

export const Layout: FC<{
  children: ReactNode;
  footer?: ReactNode;
  waitForData?: boolean;
}> = ({ children, footer, waitForData }) => {
  // React Suspense would be better, but we are not there yet.
  const dataAreLoaded = useEvoluFirstDataAreLoaded();
  const isHidden = waitForData ? !dataAreLoaded : false;

  return (
    <View className={clsx("flex-1", isHidden && "hidden")}>
      <ScrollView centerContent>
        <Container>{children}</Container>
      </ScrollView>
      <Container>
        <View className="flex-row py-3">
          {footer}
          <MainNav />
        </View>
      </Container>
    </View>
  );
};
