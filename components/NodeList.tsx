/* eslint-disable formatjs/no-literal-string-in-jsx */
import { has, model } from "evolu";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "../lib/db";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { NodeListItem } from "./NodeListItem";
import { View } from "./styled";
import { Text } from "./Text";

export const NodeList = () => {
  const intl = useIntl();
  const ids = useLocationHashNodeIds();

  const { rows } = useQuery((db) => {
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

  // console.log(loadedRows);

  if (loadedRows.length === 0)
    return ids.length === 0 ? (
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
    ) : null;

  return (
    <View
      accessibilityRole="list"
      className="py-[88px]" // A space for scrolling, 2x44
    >
      {loadedRows.map((row) => (
        <NodeListItem
          key={row.id}
          row={row}
          // x={i}
          // focusable={i === x}
          // isLast={i === loadedRows.length - 1}
        />
      ))}
    </View>
  );
};
