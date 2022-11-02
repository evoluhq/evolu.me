import Head from "next/head";
import { memo } from "react";

export const PageTitle = memo<{ prefix?: string }>(function PageTitle({
  prefix,
}) {
  const title = `${prefix ? prefix + " - " : ""}Evolu Me`;

  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
});
