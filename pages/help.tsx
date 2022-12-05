import { useIntl } from "react-intl";
import { Layout } from "../components/Layout";
import { Text } from "../components/Text";

// TODO: Explain adjacents, key navigation (with browser back too), etc.
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
