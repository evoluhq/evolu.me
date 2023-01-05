import { has, model } from "evolu";
import { memo, useMemo } from "react";
import { AdjacentNodes } from "../components/AdjacentNodes";
import { ClientOnly } from "../components/ClientOnly";
import { Container } from "../components/Container";
import { Layout } from "../components/Layout";
import { NodeEditor } from "../components/NodeEditor";
import { NodeFilter } from "../components/NodeFilter";
import { TabBar } from "../components/TabBar";
import { NodeId, useQuery } from "../lib/db";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";

const IndexWithIds = memo<{ ids: readonly NodeId[] }>(function IndexWithIds({
  ids,
}) {
  const nodes = useQuery((db) =>
    db
      .selectFrom("node")
      .select(["id", "md"])
      .where("isDeleted", "is not", model.cast(true))
      .where("id", "in", ids)
  );

  const loadedNodesRows = useMemo(
    () => nodes.rows.filter(has(["md"])),
    [nodes.rows]
  );

  const adjacentNodes = useQuery((db) => {
    // https://inviqa.com/blog/storing-graphs-database-sql-meets-social-network
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

  const loadedAdjacentNodesRows = useMemo(
    () => adjacentNodes.rows.filter(has(["md"])),
    [adjacentNodes.rows]
  );

  return (
    <Layout
      waitForData
      title=""
      centerContent
      header={
        <ClientOnly>
          <NodeFilter ids={ids} rows={loadedNodesRows} />
        </ClientOnly>
      }
      footer={
        <ClientOnly>
          <Container className="pb-0">
            <TabBar />
          </Container>
        </ClientOnly>
      }
    >
      <ClientOnly>
        {nodes.isLoaded && adjacentNodes.isLoaded && (
          <>
            {loadedNodesRows.map((row) => (
              <NodeEditor key={row.id} row={row} />
            ))}
            <AdjacentNodes ids={ids} rows={loadedAdjacentNodesRows} />
          </>
        )}
      </ClientOnly>
    </Layout>
  );
});

const Index = () => {
  // useLocationHash uses useSyncExternalStore which can dispatch
  // the same value twice. That's why we isolate it from useQuery.
  // https://github.com/facebook/react/issues/25191#issuecomment-1244805920
  const ids = useLocationHashNodeIds();
  return <IndexWithIds ids={ids} />;
};

export default Index;
