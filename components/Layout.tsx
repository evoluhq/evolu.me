import clsx from "clsx";
import { useEvoluFirstDataAreLoaded } from "evolu";
import Head from "next/head";
import { FC, ReactNode } from "react";
import { useAppDescription } from "../lib/hooks/useAppDescription";
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
  const appDescription = useAppDescription();

  return (
    <>
      <Head>
        <meta name="description" content={appDescription}></meta>
      </Head>
      <View
        className={clsx("flex-1 justify-center py-3", isHidden && "hidden")}
      >
        <View className="max-h-[700px] flex-1">
          <ScrollView centerContent>
            <Container>{children}</Container>
          </ScrollView>
          <Container>
            <View className="flex-row">{footer}</View>
            <View className="flex-row justify-end">
              <MainNav />
            </View>
          </Container>
        </View>
      </View>
    </>
  );
};
