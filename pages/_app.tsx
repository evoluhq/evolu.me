import { Provider as JotaiProvider } from "jotai";
import { NativeWindStyleSheet } from "nativewind";
import type { AppProps } from "next/app";
import Head from "next/head";
import { FC, ReactNode } from "react";
import { IntlProvider } from "react-intl";
import { useAppDescription } from "../lib/hooks/useAppDescription";
import "../styles/globals.css";
import { twMerge } from "tailwind-merge";

NativeWindStyleSheet.setWebClassNameMergeStrategy(twMerge);

// Because IntlProvider must be the parent.
const MetaDescription: FC<{ children: ReactNode }> = ({ children }) => {
  const appDescription = useAppDescription();
  return (
    <>
      <Head>
        <meta name="description" content={appDescription}></meta>
      </Head>
      {children}
    </>
  );
};

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark light" />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
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
      </Head>
      <JotaiProvider>
        <IntlProvider locale="en">
          <MetaDescription>
            <Component {...pageProps} />
          </MetaDescription>
        </IntlProvider>
      </JotaiProvider>
    </>
  );
}
