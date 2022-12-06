import clsx from "clsx";
import { has, model } from "evolu";
import { option, readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { FC, memo } from "react";
import { Text as RnText } from "react-native";
import { NodeId, useQuery } from "../lib/db";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { truncate } from "../lib/truncate";
import { Link } from "./Link";
import { PageTitle } from "./PageTitle";
import { ScrollView } from "./styled";
import { Text } from "./Text";

const AdjacentNodesLink: FC<{
  focusable: boolean;
  x: number;
  title: string;
  id: NodeId;
  isFirst: boolean;
}> = ({ x, title, id, isFirst }) => {
  const keyNavigation = useKeyNavigation<RnText>({
    x,
    keys: {
      //   ArrowRight: !isLast ? "nextX" : { id: uniqueId.mainNavButton },
      //   ArrowLeft: "previousX",
      //   ArrowUp: { id: uniqueId.createNodeInput },
    },
  });

  return (
    <Link href={`/#${id}`}>
      <Text
        as="link"
        p="base"
        className={clsx(isFirst && "pl-0")}
        {...keyNavigation}
        // focusable={focusable}
        // nativeID={nativeID}
      >
        {title}
      </Text>
    </Link>
  );
};

const AdjacentNodesWithIds = memo<{ ids: readonly NodeId[] }>(
  function AdjacentNodesLinks({ ids }) {
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
        <PageTitle title={title} />
        <ScrollView horizontal>
          <KeyboardNavigationProvider
            maxX={sortedRowsWithTruncatedTitle.length}
          >
            {({ x }) =>
              sortedRowsWithTruncatedTitle.map((row, i) => (
                <AdjacentNodesLink
                  key={row.id}
                  focusable={x === i}
                  x={i}
                  isFirst={i === 0}
                  //   isLast={false}
                  //   nativeID={uniqueId.firstAdjacentNodesItem}
                  title={row.title}
                  id={row.id}
                  //   hrefOrOnPress={`/#${pipe(
                  //     sortedRows,
                  //     readonlyArray.map((i) => i.id),
                  //     readonlyArray.dropRight(sortedRows.length - 1 - i),
                  //     nodeIdsToLocationHash
                  //   )}`}
                />
              ))
            }
          </KeyboardNavigationProvider>
        </ScrollView>
      </>
    );
  }
);

export const AdjacentNodes = () => {
  // useLocationHash uses useSyncExternalStore which can dispatch
  // the same value twice. That's why we isolate it from useQuery.
  // https://github.com/facebook/react/issues/25191#issuecomment-1244805920
  const ids = useLocationHashNodeIds();
  return <AdjacentNodesWithIds ids={ids} />;
};
