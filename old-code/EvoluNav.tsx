import { has, model } from "evolu";
import { option, readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { FC, memo } from "react";
import { useIntl } from "react-intl";
import { View as RnView } from "react-native";
import { NodeId, useQuery } from "../lib/db";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";
import { uniqueId } from "../lib/uniqueId";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { ScrollView } from "../components/styled";
import { T } from "./T";

const EvoluFilterLinkOrButton: FC<{
  focusable: boolean;
  x: number;
  isLast: boolean;
  nativeID: string;
  title: string;
  hrefOrOnPress: string | IO<void>;
}> = ({ focusable, x, isLast, nativeID, title, hrefOrOnPress }) => {
  const keyNavigation = useKeyNavigation<RnView>({
    x,
    keys: {
      ArrowRight: !isLast ? "nextX" : { id: uniqueId.mainNavButton },
      ArrowLeft: "previousX",
      ArrowUp: { id: uniqueId.createNodeInput },
    },
  });
  return typeof hrefOrOnPress === "string" ? (
    <Link href={hrefOrOnPress}>
      <T v="tb" {...keyNavigation} focusable={focusable} nativeID={nativeID}>
        {title}
      </T>
    </Link>
  ) : (
    <Button
      {...keyNavigation}
      focusable={focusable}
      nativeID={nativeID}
      onPress={hrefOrOnPress}
    >
      <T v="tb">{title}</T>
    </Button>
  );
};

// useLocationHash uses useSyncExternalStore which can dispatch
// the same value twice.
// https://github.com/facebook/react/issues/25191#issuecomment-1244805920
const EvoluFilterWorkaround = memo<{ ids: readonly NodeId[] }>(
  function EvoluFilterWorkaround({ ids }) {
    const intl = useIntl();

    const { rows } = useQuery((db) =>
      db
        .selectFrom("node")
        .select(["id", "title"])
        .where("isDeleted", "is not", model.cast(true))
        .where("id", "in", ids)
    );

    // The same order like ids from location hash.
    const sortedRows = pipe(
      ids,
      readonlyArray.filterMap((id) =>
        option.fromNullable(rows.find((row) => row.id === id))
      ),
      readonlyArray.filter(has(["title"]))
    );

    return (
      <ScrollView horizontal>
        <KeyboardNavigationProvider maxX={sortedRows.length + 1}>
          {({ x }) => (
            <>
              <EvoluFilterLinkOrButton
                focusable={x === 0}
                x={0}
                isLast={false}
                nativeID={uniqueId.firstAdjacentNodesItem}
                title={intl.formatMessage({
                  defaultMessage: "All",
                  id: "zQvVDJ",
                })}
                hrefOrOnPress="/"
              />
              {sortedRows.map((row, i) => (
                <EvoluFilterLinkOrButton
                  key={row.id}
                  focusable={x === i + 1}
                  x={i + 1}
                  isLast={false}
                  nativeID={uniqueId.firstAdjacentNodesItem}
                  title={row.title}
                  hrefOrOnPress={`/#${pipe(
                    sortedRows,
                    readonlyArray.map((i) => i.id),
                    readonlyArray.dropRight(sortedRows.length - 1 - i),
                    nodeIdsToLocationHash
                  )}`}
                />
              ))}
              <EvoluFilterLinkOrButton
                focusable={x === sortedRows.length + 1}
                x={sortedRows.length + 1}
                isLast={true}
                nativeID={uniqueId.lastAdjacentNodesItem}
                title="…"
                hrefOrOnPress={() => {
                  alert("todo");
                }}
              />
            </>
          )}
        </KeyboardNavigationProvider>
      </ScrollView>
    );
  }
);

export const EvoluFilter = () => {
  const ids = useLocationHashNodeIds();
  return <EvoluFilterWorkaround ids={ids} />;
};
