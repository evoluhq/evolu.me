import Head from "next/head";
import { memo } from "react";

export const PageTitle = memo<{ title: string }>(function PageTitle({ title }) {
  const fullTitle = title.includes("EvoluMe") ? title : `${title} – EvoluMe`;

  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  );
});
