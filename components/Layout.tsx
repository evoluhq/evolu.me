import clsx from "clsx";
import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { Container } from "./Container";
import { MainNav } from "./MainNav";
import { ScrollView, View } from "./styled";

export const Layout: FC<{
  children: ReactNode;
  waitForData?: boolean;
  footer?: ReactNode;
}> = ({ children, waitForData, footer }) => {
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
          <View className="flex-1">{footer}</View>
          <MainNav />
        </View>
      </Container>
    </View>
  );
};
