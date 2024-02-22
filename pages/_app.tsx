import * as S from "@effect/schema/Schema";
import { NotNull, cast } from "@evolu/react";
import { create, props } from "@stylexjs/stylex";
import { Either, Function } from "effect";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode, useEffect } from "react";
import { MainNav } from "../components/MainNav";
import { Providers } from "../components/Providers";
import { evolu } from "../lib/Db";
import { ContentMax10kFromContent } from "../lib/Lexical";
import { appSpacing, webSpacing } from "../lib/Themes";
import { colors } from "../lib/Tokens.stylex";
import { devBaseline } from "../lib/devBaseline";
import "../styles/globals.css";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const _noteContents = evolu.createQuery((db) =>
  db
    .selectFrom("_noteContent")
    .select(["id", "content"])
    .where("content", "is not", null)
    .$narrowType<{ content: NotNull }>(),
);

export default function App({
  Component,
  pageProps,
  router,
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  /**
   * If the app was closed before local-only notes were saved as to-sync notes,
   * we must save them on start.
   *
   * "Great applications do not lose user's progress and app state. They
   * automatically save the necessary data without interrupting the user and
   * transparently restore themselves as and when necessary - e.g. after coming
   * back from a background state or an unexpected shutdown."
   * https://www.igvita.com/2015/11/20/dont-lose-user-and-app-state-use-page-visibility/
   */
  useEffect(() => {
    void evolu.loadQuery(_noteContents).then(({ rows }) => {
      rows.forEach((row) => {
        S.decodeEither(ContentMax10kFromContent)(row.content).pipe(
          Either.match({
            onLeft: Function.constVoid,
            onRight: (content) => {
              // With Evolu, subsequent mutations are always run within a transaction.
              evolu.update("note", { ...row, content });
              evolu.update("_noteContent", {
                id: row.id,
                isDeleted: cast(true),
              });
            },
          }),
        );
      });
    });
  }, []);

  const useAppSpacing =
    router.asPath === "/" || router.asPath.startsWith("/day");

  return (
    <Providers>
      <Head>
        <title>Evolu.me</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <div
        {...props(
          useAppSpacing ? appSpacing : webSpacing,
          styles.container,
          false && devBaseline(useAppSpacing),
        )}
      >
        <MainNav />
        {getLayout(<Component {...pageProps} />)}
      </div>
    </Providers>
  );
}

const styles = create({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.background,
  },
});
