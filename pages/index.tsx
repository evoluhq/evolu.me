import { has, model } from "evolu";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { AdjacentNodes } from "../components/AdjacentNodes";
import { ClientOnly } from "../components/ClientOnly";
import { Container } from "../components/Container";
import { Layout } from "../components/Layout";
import { NodeEditor } from "../components/NodeEditor";
import { View } from "../components/styled";
import { TabBar } from "../components/TabBar";
import { useQuery } from "../lib/db";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";

const Index = () => {
  const ids = useLocationHashNodeIds();
  const intl = useIntl();
  const nodes = useQuery((db) =>
    db
      .selectFrom("node")
      .select(["id", "md"])
      .where("isDeleted", "is not", model.cast(true))
      .where("id", "in", ids)
  );

  const loadedNodesRows = useMemo(
    () =>
      nodes.rows
        .filter(has(["md"]))
        .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)),
    [ids, nodes.rows]
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

  const [initialRender, setInitialRender] = useState(true);

  const initialIdsRef = useRef(ids);

  // This only works for the root page aka without a hash.
  // A page with the hash will be rendered twice (without then with a hash).
  useEffect(() => {
    if (initialRender && initialIdsRef.current !== ids) setInitialRender(false);
  }, [ids, initialRender]);

  return (
    <Layout
      waitForData
      title={intl.formatMessage({
        defaultMessage: "EvoluMe - Personal Knowledge Graph Focused on Privacy",
        id: "jznzji",
      })}
      header={
        <ClientOnly>
          {/* Here will be menu, graph view, search, favorites, whatever. */}
          <></>
        </ClientOnly>
      }
      footer={
        <ClientOnly>
          <Container className="pb-0">
            <TabBar ids={ids} rows={loadedNodesRows} />
          </Container>
        </ClientOnly>
      }
    >
      <ClientOnly>
        {nodes.isLoaded && adjacentNodes.isLoaded && (
          <View className="flex-1">
            {loadedNodesRows.map((row) => (
              <NodeEditor key={row.id} row={row} />
            ))}
            <View className="flex-1 justify-center">
              <AdjacentNodes
                ids={ids}
                rows={loadedAdjacentNodesRows}
                initialRender={initialRender}
              />
            </View>
          </View>
        )}
      </ClientOnly>
    </Layout>
  );
};

export default Index;
