import Head from "next/head";
import { memo } from "react";

export const PageTitle = memo<{ prefix?: string }>(({ prefix }) => {
  const title = `${prefix ? prefix + " - " : ""}Evolu`;

  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
});

PageTitle.displayName = "PageTitle";
