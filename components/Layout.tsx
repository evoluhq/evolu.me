import clsx from "clsx";
import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { accessibility } from "../lib/accessibility";
import { Container } from "./Container";
import { MainNav } from "./MainNav";
import { PageTitle } from "./PageTitle";
import { ScrollView, View } from "./styled";
import { Text } from "./Text";

const Header: FC<{ title: string }> = ({ title }) => {
  return (
    <Container className="absolute inset-x-0 z-10" backdrop>
      <View className="flex-row">
        <Text className="flex-1 p-2" {...accessibility.heading(1)}>
          {title}
        </Text>
        <MainNav />
      </View>
    </Container>
  );
};

export const Layout: FC<{
  children: ReactNode;
  title: string;
  waitForData?: boolean;
  footer?: ReactNode;
  centerContent?: boolean;
}> = ({ children, title, waitForData, footer, centerContent }) => {
  // React Suspense would be better, but we are not there yet.
  const dataAreLoaded = useEvoluFirstDataAreLoaded();
  const isHidden = waitForData ? !dataAreLoaded : false;

  return (
    <>
      <PageTitle title={title} />
      <View className={clsx("flex-1 justify-center", isHidden && "hidden")}>
        <View className="max-h-[700px] flex-1">
          <Header title={title} />
          <ScrollView centerContent={centerContent}>
            <Container className={clsx(!centerContent && "pt-24")}>
              {children}
            </Container>
          </ScrollView>
          {footer}
        </View>
      </View>
    </>
  );
};
