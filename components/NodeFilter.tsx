import clsx from "clsx";
import { has, model } from "evolu";
import { option, readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { useRouter } from "next/router";
import { FC, memo } from "react";
import { NodeId, useQuery } from "../lib/db";
import { focusClassName, focusClassNames } from "../lib/focusClassNames";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { truncate } from "../lib/truncate";
import { Link } from "./Link";
import { PageTitle } from "./PageTitle";
import { ScrollView, View } from "./styled";
import { Text } from "./Text";

const NodeFilterLink: FC<{
  focusable: boolean;
  id: NodeId;
  isFirst: boolean;
  title: string;
  x: number;
}> = ({ focusable, id, isFirst, title, x }) => {
  const router = useRouter();
  const keyNavigation = useKeyNavigation({
    x,
    keys: {
      ArrowLeft: "previousX",
      ArrowRight: "nextX",
      ArrowDown: focusClassName("firstNodeItemLink"),
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
        {title}
      </Text>
    </Link>
  );
};

const NodeFilterWithIds = memo<{ ids: readonly NodeId[] }>(
  function NodeFilterLinks({ ids }) {
    const { rows } = useQuery((db) =>
      db
        .selectFrom("node")
        .select(["id", "title"])
        .where("isDeleted", "is not", model.cast(true))
        .where("id", "in", ids)
    );

    const sortedRowsWithTruncatedTitle = pipe(
      ids, // The same order like ids from location hash.
      readonlyArray.filterMap((id) =>
        option.fromNullable(rows.find((row) => row.id === id))
      ),
      readonlyArray.filter(has(["title"])),
      readonlyArray.map((a) => ({
        ...a,
        title: truncate(a.title)({ maxLength: 21 }).text,
      }))
    );

    const title = pipe(
      sortedRowsWithTruncatedTitle,
      readonlyArray.map((i) => i.title)
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
                    title={row.title}
                    x={i}
                  />
                ))
              }
            </KeyboardNavigationProvider>
          </View>
        </ScrollView>
      </>
    );
  }
);

export const NodeFilter = () => {
  // useLocationHash uses useSyncExternalStore which can dispatch
  // the same value twice. That's why we isolate it from useQuery.
  // https://github.com/facebook/react/issues/25191#issuecomment-1244805920
  const ids = useLocationHashNodeIds();
  return <NodeFilterWithIds ids={ids} />;
};
