import { promises as fs } from "fs";
import type { GetStaticProps, InferGetStaticPropsType } from "next";
import path from "path";
import Markdown from "react-markdown";
import { PageWithTitle } from "../../components/PageWithTitle";
import { Text } from "../../components/Text";
import { create } from "@stylexjs/stylex";

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
            return (
              <Text tag="h3" style={styles.p}>
                {children}
              </Text>
            );
          },
          ul({ children }) {
            return <>{children}</>;
          },
          li({ children }) {
            return (
              <Text tag="p" style={styles.p}>
                {children}
              </Text>
            );
          },
          p({ children }) {
            if (typeof children !== "string") return null;
            return <>{children.trim()}</>;
          },
        }}
      >
        {markdown}
      </Markdown>
    </PageWithTitle>
  );
}

const styles = create({
  p: {
    whiteSpace: "normal",
  },
});
