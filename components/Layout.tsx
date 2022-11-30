import clsx from "clsx";
import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { Container } from "./Container";
import { MainNav } from "./MainNav";
import { PageTitle } from "./PageTitle";
import { ScrollView, View } from "./styled";

export const Layout: FC<{
  children: ReactNode;
  title: string;
  waitForData?: boolean;
  footer?: ReactNode;
}> = ({ children, title, waitForData, footer }) => {
  // React Suspense would be better, but we are not there yet.
  const dataAreLoaded = useEvoluFirstDataAreLoaded();
  const isHidden = waitForData ? !dataAreLoaded : false;

  return (
    <>
      <PageTitle title={title} />
      <View className={clsx("flex-1 justify-center", isHidden && "hidden")}>
        <View className="max-h-[700px] flex-1">
          <Container>
            <View className="flex-row">
              <View className="flex-1" />
              <MainNav />
            </View>
          </Container>
          <ScrollView centerContent>
            <Container>{children}</Container>
          </ScrollView>
          {footer && <Container>{footer}</Container>}
        </View>
      </View>
    </>
  );
};
