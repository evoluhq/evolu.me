import { model } from "evolu";
import { NodeId, useQuery } from "./db";

// https://inviqa.com/blog/storing-graphs-database-sql-meets-social-network

export const useQueryNodesByIds = (ids: readonly NodeId[]) => {
  return useQuery((db) =>
    db
      .selectFrom("node")
      .select(["id", "md"])
      .where("isDeleted", "is not", model.cast(true))
      .where("id", "in", ids)
  );
};

export const useQueryConnectedNodesSortedByCreatedAtDesc = (
  ids: readonly NodeId[]
) => {
  return useQuery((db) => {
    let q = db
      .selectFrom("node")
      .select(["id", "md"])
      .orderBy("createdAt", "desc")
      .where("isDeleted", "is not", model.cast(true));

    ids.forEach((adjacentId) => {
      q = q.where("id", "in", (qb) =>
        qb
          .selectFrom("edge")
          .where("isDeleted", "is not", model.cast(true))
          .where("b", "=", adjacentId)
          .select("a as id")
          .union(
            qb
              .selectFrom("edge")
              .where("isDeleted", "is not", model.cast(true))
              .where("a", "=", adjacentId)
              .select("b as id")
          )
      );
    });

    return q;
  });
};
