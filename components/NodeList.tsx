/* eslint-disable formatjs/no-literal-string-in-jsx */
import { has, model, NodeId } from "evolu";
import { FC, useLayoutEffect, useMemo } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "../lib/db";
import { focusClassName } from "../lib/focusClassNames";
import { KeyboardNavigationProvider } from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { layoutScroll } from "../lib/layoutScroll";
import { Button } from "./Button";
import { NodeItem } from "./NodeItem";
import { NodeListFocus } from "./NodeListFocus";
import { View } from "./styled";
import { Text } from "./Text";

const PlaceholderHelp: FC<{ ids: readonly NodeId[] }> = ({ ids }) => {
  const intl = useIntl();

  const getMessage = (): string => {
    switch (ids.length) {
      case 0:
        return intl.formatMessage({
          defaultMessage: `Here will be your thoughts, organized.

You can connect anything with anything.
For example: to see - Arrival movie

Write a thought, press enter, and click on the link.
`,
          id: "pZB8g5",
        });
      case 1:
        return intl.formatMessage({
          defaultMessage: "Add something related.",
          id: "LaSyKs",
        });
      default:
        return intl.formatMessage({
          defaultMessage: `You added something else to the filter, and that's how we can filter and connect more thoughts altogether.

For example: to see - Arrival - tomorrow

Of course, you can connect "tomorrow" with "to buy" and anything else.`,
          id: "+vUqCW",
        });
    }
  };

  return (
    <Button onPress={focusClassName("createNodeInput")}>
      <Text className="text-center">{getMessage()}</Text>
    </Button>
  );
};

export const NodeList = () => {
  const ids = useLocationHashNodeIds();

  const { rows, isLoaded } = useQuery((db) => {
    let q = db
      .selectFrom("node")
      .select(["id", "title"])
      .orderBy("createdAt")
      .where("isDeleted", "is not", model.cast(true));

    // https://inviqa.com/blog/storing-graphs-database-sql-meets-social-network
    ids.forEach((relatedId) => {
      q = q.where("id", "in", (qb) =>
        qb
          .selectFrom("edge")
          .where("b", "=", relatedId)
          .select("a as id")
          .union(
            qb.selectFrom("edge").where("a", "=", relatedId).select("b as id")
          )
      );
    });

    return q;
  });

  const loadedRows = useMemo(() => rows.filter(has(["title"])), [rows]);

  useLayoutEffect(() => layoutScroll.scrollToEndAnimatedIfRequested());

  const idsString = ids.join();
  useLayoutEffect(() => {
    if (!isLoaded) return;
    layoutScroll.restoreScroll(idsString);
    return () => {
      layoutScroll.storeScroll(idsString);
    };
  }, [idsString, isLoaded]);

  if (!isLoaded) return null;
  if (loadedRows.length === 0) return <PlaceholderHelp ids={ids} />;

  return (
    <View
      accessibilityRole="list"
      // className="py-[88px]" // A space for scrolling, 2x44
    >
      <KeyboardNavigationProvider
        maxX={loadedRows.length - 1}
        maxY={1}
        initialY={1}
      >
        {({ x, y }) => (
          <>
            <NodeListFocus />
            {loadedRows.map((row, i) => (
              <NodeItem
                key={row.id}
                row={row}
                x={i}
                focusable={i === x && (y === 0 ? "button" : "input")}
                isFirst={i === 0}
                isLast={i === loadedRows.length - 1}
              />
            ))}
          </>
        )}
      </KeyboardNavigationProvider>
    </View>
  );
};
