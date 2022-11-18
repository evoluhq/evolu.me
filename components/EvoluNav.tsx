import { has, model } from "evolu";
import { option, readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { FC, memo } from "react";
import { useIntl } from "react-intl";
import { View as RnView } from "react-native";
import { EvoluId, useQuery } from "../lib/db";
import { evoluIdsToLocationHash } from "../lib/evoluIdsToLocationHash";
import { uniqueId } from "../lib/uniqueId";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashEvoluIds } from "../lib/hooks/useLocationHashEvoluIds";
import { Button } from "./Button";
import { Link } from "./Link";
import { ScrollView } from "./styled";
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
      ArrowUp: { id: uniqueId.createEvoluInput },
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
const EvoluFilterWorkaround = memo<{ ids: readonly EvoluId[] }>(
  function EvoluFilterWorkaround({ ids }) {
    const intl = useIntl();

    const { rows } = useQuery((db) =>
      db
        .selectFrom("evolu")
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
                nativeID={uniqueId.firstEvoluNavItem}
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
                  nativeID={uniqueId.firstEvoluNavItem}
                  title={row.title}
                  hrefOrOnPress={`/#${pipe(
                    sortedRows,
                    readonlyArray.map((i) => i.id),
                    readonlyArray.dropRight(sortedRows.length - 1 - i),
                    evoluIdsToLocationHash
                  )}`}
                />
              ))}
              <EvoluFilterLinkOrButton
                focusable={x === sortedRows.length + 1}
                x={sortedRows.length + 1}
                isLast={true}
                nativeID={uniqueId.lastEvoluNavItem}
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
  const ids = useLocationHashEvoluIds();
  return <EvoluFilterWorkaround ids={ids} />;
};
