import clsx from "clsx";
import { option, readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { useRouter } from "next/router";
import { FC, memo } from "react";
import { NodeId, NodeMarkdown } from "../lib/db";
import { focusClassNames } from "../lib/focusClassNames";
import { getFirstLine } from "../lib/getFirstLine";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { truncate } from "../lib/truncate";
import { Link } from "./Link";
import { PageTitle } from "./PageTitle";
import { ScrollView, View } from "./styled";
import { Text } from "./Text";

const NodeFilterLink: FC<{
  focusable: boolean;
  id: NodeId;
  isFirst: boolean;
  md: string;
  x: number;
}> = ({ focusable, id, isFirst, md, x }) => {
  const router = useRouter();
  const keyNavigation = useKeyNavigation({
    x,
    keys: {
      ArrowLeft: "previousX",
      ArrowRight: "nextX",
      // ArrowDown: focusClassName("firstNodeItemLink"),
      Escape: () => router.back(),
    },
  });

  return (
    <Link href={`/#${id}`}>
      <Text
        as="link"
        p
        className={clsx(
          "my-1 py-1",
          isFirst && focusClassNames.firstNodeFilterLink
        )}
        {...keyNavigation}
        // @ts-expect-error RNfW
        focusable={focusable}
      >
        {md}
      </Text>
    </Link>
  );
};

export const NodeFilter = memo<{
  ids: readonly NodeId[];
  rows: readonly { id: NodeId; md: NodeMarkdown }[];
}>(function NodeFilterLinks({ ids, rows }) {
  const sortedRowsWithTruncatedTitle = pipe(
    ids, // The same order like ids from location hash.
    readonlyArray.filterMap((id) =>
      option.fromNullable(rows.find((row) => row.id === id))
    ),
    readonlyArray.map((a) => ({
      ...a,
      md: pipe(a.md, getFirstLine, truncate)({ maxLength: 21 }).text,
    }))
  );

  const title = pipe(
    sortedRowsWithTruncatedTitle,
    readonlyArray.map((i) => i.md)
  ).join(" | ");

  return (
    <>
      {title.length > 0 && <PageTitle title={title} />}
      {/* ml to ensure focus ring is visible */}
      <ScrollView horizontal className="-ml-[1px]">
        <View className="ml-[1px] flex-row">
          <KeyboardNavigationProvider
            maxX={sortedRowsWithTruncatedTitle.length}
          >
            {({ x }) =>
              sortedRowsWithTruncatedTitle.map((row, i) => (
                <NodeFilterLink
                  key={row.id}
                  focusable={x === i}
                  id={row.id}
                  isFirst={i === 0}
                  md={row.md}
                  x={i}
                />
              ))
            }
          </KeyboardNavigationProvider>
        </View>
      </ScrollView>
    </>
  );
});
