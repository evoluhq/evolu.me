import { promises as fs } from "fs";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import path from "path";
import { Children } from "react";
import Markdown from "react-markdown";
import { PageWithTitle } from "../../components/PageWithTitle";
import { Text } from "../../components/Text";

export const getStaticProps = (async () => {
  const rawMarkdown = await fs.readFile(
    path.join(process.cwd(), "CHANGELOG.md"),
    "utf8",
  );

  const markdown = rawMarkdown
    .replace("# evolu.me", "")
    .replaceAll("### Minor Changes", "")
    .replace(/[a-zA-Z0-9]{7}: /g, "")
    .trim();

  return {
    props: {
      markdown,
    },
  };
}) satisfies GetStaticProps<{
  markdown: string;
}>;

export default function Changelog({
  markdown,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <PageWithTitle title="Changelog">
      <Markdown
        components={{
          h2({ children }) {
            return <Text tag="h3">{children}</Text>;
          },
          ul({ children }) {
            return <>{children}</>;
          },
          li({ children }) {
            return (
              <>
                {Children.map(children, (child) => {
                  if (child === "\n") return null;
                  if (typeof child === "string")
                    return <Text tag="p">{children}</Text>;
                  return child;
                })}
              </>
            );
          },
          p({ children }) {
            return <Text tag="p">{children}</Text>;
          },
        }}
      >
        {markdown}
      </Markdown>
    </PageWithTitle>
  );
}
