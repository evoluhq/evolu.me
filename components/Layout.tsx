import clsx from "clsx";
import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { accessibility } from "../lib/accessibility";
import { ScrollRestoration } from "../lib/hooks/useScrollRestoration";
import { Container } from "./Container";
import { MainNav } from "./MainNav";
import { PageTitle } from "./PageTitle";
import { ScrollView, View } from "./styled";
import { Text } from "./Text";

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});

export const Layout: FC<{
  children: ReactNode;
  title: string;
  waitForData?: boolean;
  header?: ReactNode;
  footer?: ReactNode;
}> = ({ children, title, waitForData, header, footer }) => {
  // React Suspense would be better, but we are not there yet.
  const dataAreLoaded = useEvoluFirstDataAreLoaded();
  const isHidden = waitForData ? !dataAreLoaded : false;

  return (
    <>
      <PageTitle title={title} />
      <View className={clsx("flex-1", isHidden && "hidden")}>
        <Container className="pb-0">
          <View className="flex-row-reverse">
            <MainNav />
            <View className="flex-1">
              {header || (
                <Text p className="flex-1 pl-0" {...accessibility.heading(1)}>
                  {title}
                </Text>
              )}
            </View>
          </View>
        </Container>
        <ScrollRestoration>
          {(props) => (
            <>
              <ScrollView
                // To ensure smooth scroll on key navigation focus.
                className="scroll-smooth"
                contentContainerStyle={styles.contentContainer}
                {...props}
              >
                <Container className="flex-1">{children}</Container>
              </ScrollView>
              {footer}
            </>
          )}
        </ScrollRestoration>
      </View>
    </>
  );
};
