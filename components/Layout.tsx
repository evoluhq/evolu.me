import clsx from "clsx";
import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { accessibility } from "../lib/accessibility";
import { ScrollRestoration } from "../lib/hooks/useScrollRestoration";
import { Container } from "./Container";
import { MainNav } from "./MainNav";
import { PageTitle } from "./PageTitle";
import { SafeAreaView, ScrollView, View } from "./styled";
import { Text } from "./Text";

export const Layout: FC<{
  children: ReactNode;
  title: string;
  waitForData?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
  centerContent?: boolean;
}> = ({ children, title, waitForData, header, footer, centerContent }) => {
  // React Suspense would be better, but we are not there yet.
  const dataAreLoaded = useEvoluFirstDataAreLoaded();
  const isHidden = waitForData ? !dataAreLoaded : false;

  return (
    <>
      <PageTitle title={title} />
      <SafeAreaView className={clsx("flex-1", isHidden && "hidden")}>
        <Container>
          <View className="flex-row">
            {header || (
              <Text p className="flex-1 pl-0" {...accessibility.heading(1)}>
                {title}
              </Text>
            )}
            <MainNav />
          </View>
        </Container>
        <ScrollRestoration>
          {(props) => (
            <>
              <ScrollView centerContent={centerContent} {...props}>
                <Container>{children}</Container>
              </ScrollView>
              {footer}
            </>
          )}
        </ScrollRestoration>
      </SafeAreaView>
    </>
  );
};
