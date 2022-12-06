/* eslint-disable formatjs/no-literal-string-in-jsx */
import { useIntl } from "react-intl";
import { Layout } from "../components/Layout";
import { View } from "../components/styled";
import { Text } from "../components/Text";
import { useAppDescription } from "../lib/hooks/useAppDescription";

const About = () => {
  const intl = useIntl();
  const appDescription = useAppDescription();

  return (
    <Layout
      title={intl.formatMessage({ defaultMessage: "About", id: "g5pX+a" })}
      centerContent
    >
      <Text mb>{appDescription}</Text>
      <View className="flex-row">
        <Text
          as="link"
          mb
          transparent
          // @ts-expect-errors RNfW
          href="https://github.com/evoluhq/evolu.me"
          hrefAttrs={{ target: "blank" }}
        >
          GitHub
        </Text>
      </View>
    </Layout>
  );
};

export default About;
