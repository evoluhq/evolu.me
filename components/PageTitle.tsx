import Head from "next/head";
import { memo } from "react";

export const PageTitle = memo<{ title?: string }>(function PageTitle({
  title,
}) {
  const fullTitle = title
    ? `${title} – EvoluMe`
    : "EvoluMe - Personal Knowledge Graph Focused on Privacy";
  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  );
});
