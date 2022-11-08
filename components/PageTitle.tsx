import Head from "next/head";
import { memo } from "react";

export const PageTitle = memo<{ title?: string }>(function PageTitle({
  title,
}) {
  const fullTitle = `${title ? title + " - " : ""}Evolu Me`;

  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  );
});
