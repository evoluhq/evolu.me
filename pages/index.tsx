import { has } from "evolu";
import { option, readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { isNonEmpty } from "fp-ts/lib/ReadonlyArray";
import { useMemo } from "react";
import { useIntl } from "react-intl";
import { AdjacentNodes } from "../components/AdjacentNodes";
import { ClientOnly } from "../components/ClientOnly";
import { Container } from "../components/Container";
import { Layout } from "../components/Layout";
import { NodeEditor } from "../components/NodeEditor";
import { View } from "../components/styled";
import { TabBar } from "../components/TabBar";
import { getFirstLineAlwaysVisible } from "../lib/getFirstLineAlwaysVisible";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import {
  useQueryConnectedNodesSortedByCreatedAtDesc,
  useQueryNodesByIds,
} from "../lib/queries";

const Index = () => {
  const ids = useLocationHashNodeIds();
  const intl = useIntl();

  const contextNodes = useQueryNodesByIds(ids);
  const connectedNodes = useQueryConnectedNodesSortedByCreatedAtDesc(ids);

  const loadedAndSortedContextNodesRows = useMemo(
    () =>
      contextNodes.rows
        .filter(has(["md"]))
        .sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id)),
    [ids, contextNodes.rows]
  );

  const loadedAdjacentNodesRows = useMemo(
    () => connectedNodes.rows.filter(has(["md"])),
    [connectedNodes.rows]
  );

  const title = pipe(
    loadedAndSortedContextNodesRows,
    option.fromPredicate(isNonEmpty),
    option.map(readonlyArray.map((a) => getFirstLineAlwaysVisible(a.md))),
    option.map((a) => a.join(" | ")),
    option.getOrElse(() =>
      intl.formatMessage({
        defaultMessage: "EvoluMe - Personal Knowledge Graph Focused on Privacy",
        id: "jznzji",
      })
    )
  );

  return (
    <Layout
      waitForData
      title={title}
      header={
        <ClientOnly>
          {/* Here will be menu, graph view, search, favorites, whatever. */}
          <></>
        </ClientOnly>
      }
      footer={
        <ClientOnly>
          <Container className="pb-0">
            <TabBar ids={ids} rows={loadedAndSortedContextNodesRows} />
          </Container>
        </ClientOnly>
      }
    >
      <ClientOnly>
        {contextNodes.isLoaded && connectedNodes.isLoaded && (
          <View className="flex-1">
            {loadedAndSortedContextNodesRows.map((row) => (
              <NodeEditor key={row.id} row={row} />
            ))}
            <View className="flex-1 justify-center">
              <AdjacentNodes ids={ids} rows={loadedAdjacentNodesRows} />
            </View>
          </View>
        )}
      </ClientOnly>
    </Layout>
  );
};

export default Index;
