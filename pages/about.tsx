import { useIntl } from "react-intl";
import { About } from "../components/About";
import { Layout } from "../components/Layout";
import { View } from "../components/styled";
import { Text } from "../components/Text";

const AboutPage = () => {
  const intl = useIntl();

  return (
    <Layout
      title={intl.formatMessage({ defaultMessage: "About", id: "g5pX+a" })}
    >
      <View className="flex-1 justify-center">
        <About />
        <View className="mt-4 flex-row justify-center">
          <Text
            as="link"
            mb
            transparent
            // @ts-expect-errors RNfW
            href="https://github.com/evoluhq/evolu.me"
            hrefAttrs={{ target: "blank" }}
            // eslint-disable-next-line formatjs/no-literal-string-in-jsx
          >
            GitHub
          </Text>
        </View>
      </View>
    </Layout>
  );
};

export default AboutPage;
