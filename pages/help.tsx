import { useIntl } from "react-intl";
import { Layout } from "../components/Layout";
import { View } from "../components/styled";
import { Text } from "../components/Text";

// TODO: Explain graph, filter, key navigation, etc.
// A Graph is a collection of nodes and connections.
// Any node in the graph can be connected to any other node in the graph.
// Your notes are messy, unstructured and completely unconnected?
// On a knowledge graph, you create nodes instead of notes,
// these are dynamic building blocks that you can connect to other pieces of
// information. Beautiful visualisations of your knowledge...
// EvoluMe is a tool for organizing thoughts.
// Write thoughts your don't want to remember but also you don't want
// to forget. Connect anything with anything. Here are some examples:
// TODO: Keyboard.
// Remember, it's not trees, it's undirected graph... The difference is...
// You have more than one item in the filter, and that's how you can filter or connect as many thoughts as necessary.
// The beauty is that you can connect anything with anything.
// The possibilities are endless.`,

const Help = () => {
  const intl = useIntl();

  return (
    <Layout
      title={intl.formatMessage({ defaultMessage: "Help", id: "SENRqu" })}
    >
      <View className="flex-1 justify-center">
        <Text className="text-center">
          {intl.formatMessage({
            defaultMessage: `Under construction 🚧
            
For keyboard navigation, you can use:
a tab, arrows, enter, escape`,
            id: "02TW27",
          })}
        </Text>
      </View>
    </Layout>
  );
};

export default Help;
