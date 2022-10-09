import Head from "next/head";
import { memo } from "react";

export const PageTitle = memo<{ prefix?: string }>(({ prefix }) => {
  return (
    <Head>
      <title>{prefix ? `${prefix} - ` : ""}Evolu</title>
    </Head>
  );
});

PageTitle.displayName = "PageTitle";
