import { useIntl } from "react-intl";
import { Layout } from "../components/Layout";
import { Text } from "../components/Text";

// TODO: Explain graph, filter, key navigation, etc.
// A Graph is a collection of nodes and connections.
// Any node in the graph can be connected to any other node in the graph.
// Your notes are messy, unstructured and completely unconnected?
// On a knowledge graph, you create nodes instead of notes,
// these are dynamic building blocks that you can connect to other pieces of
// information. Beautiful visualisations of your knowledge...

// Evolu Me is a tool for organizing thoughts.
// Write thoughts your don't want to remember but also you don't want
// to forget. Connect anything with anything. Here are some examples:
// TODO: Keyboard.
// Remember, it's not trees, it's undirected graph... The difference is...

const Help = () => {
  const intl = useIntl();

  return (
    <Layout
      title={intl.formatMessage({ defaultMessage: "Help", id: "SENRqu" })}
      centerContent
    >
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Under construction 🚧",
          id: "Q4maGs",
        })}
      </Text>
    </Layout>
  );
};

export default Help;
