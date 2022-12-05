import clsx from "clsx";
import { useEvoluFirstDataAreLoaded } from "evolu";
import { FC, ReactNode } from "react";
import { accessibility } from "../lib/accessibility";
import { Container } from "./Container";
import { MainNav } from "./MainNav";
import { PageTitle } from "./PageTitle";
import { ScrollView, View } from "./styled";
import { Text } from "./Text";

export const Layout: FC<{
  children: ReactNode;
  title: string | JSX.Element;
  waitForData?: boolean;
  footer?: ReactNode;
  centerContent?: boolean;
}> = ({ children, title, waitForData, footer, centerContent }) => {
  // React Suspense would be better, but we are not there yet.
  const dataAreLoaded = useEvoluFirstDataAreLoaded();
  const isHidden = waitForData ? !dataAreLoaded : false;
  const titleIsString = typeof title === "string";

  return (
    <>
      {titleIsString && <PageTitle title={title} />}
      <View className={clsx("flex-1 justify-center", isHidden && "hidden")}>
        <View className="max-h-[700px] flex-1">
          <Container className="absolute inset-x-0 z-10" backdrop>
            <View className="flex-row">
              {titleIsString ? (
                <Text
                  p="base"
                  className="flex-1 pl-0"
                  {...accessibility.heading(1)}
                >
                  {title}
                </Text>
              ) : (
                title
              )}
              <MainNav />
            </View>
          </Container>
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
