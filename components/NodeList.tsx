import { has, model } from "evolu";
import { useLayoutEffect, useMemo } from "react";
import { useQuery } from "../lib/db";
import { KeyboardNavigationProvider } from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { layoutScroll } from "../lib/layoutScroll";
import { NodeItem } from "./NodeItem";
import { NodeListPlaceholder } from "./NodeListPlaceholder";
import { View } from "./styled";

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
  if (loadedRows.length === 0) return <NodeListPlaceholder ids={ids} />;

  // console.log("x");

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
        {({ x, y }) =>
          loadedRows.map((row, i) => (
            <NodeItem
              key={row.id}
              row={row}
              x={i}
              focusable={i === x && (y === 0 ? "button" : "input")}
              isFirst={i === 0}
              isLast={i === rows.length - 1}
            />
          ))
        }
      </KeyboardNavigationProvider>
    </View>
  );
};
