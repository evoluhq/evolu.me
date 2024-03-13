import { create, props } from "@stylexjs/stylex";
import Head from "next/head";
import { FC, ReactNode } from "react";
import { ScrollView } from "react-native";
import { baseline, consts, spacing } from "../lib/Tokens.stylex";
import { Text } from "./Text";

export const PageWithTitle: FC<{
  children: ReactNode;
  title: string;
}> = ({ children, title }) => {
  return (
    <ScrollView>
      <div {...props(styles.container)}>
        <Head>
          <title>{title + " – Evolu.me"}</title>
        </Head>
        <Text tag="h1">{title}</Text>
        {children}
      </div>
    </ScrollView>
  );
};

const styles = create({
  container: {
    width: "100%",
    maxWidth: consts.maxWidth,
    marginInline: "auto",
    paddingInline: spacing.s,
    // Header is 44px height, compensate it for the content baseline.
    paddingTop: `calc(2 * ${baseline.web} - 2 * ${baseline.app})`,
    display: "grid",
    gridRowGap: spacing.m,
    paddingBottom: spacing.l,
  },
});
