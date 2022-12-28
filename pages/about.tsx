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
      <Text mb>
        {intl.formatMessage({
          defaultMessage:
            "Focused on privacy means all data are end-to-end encrypted. You don't even have to create an account to use this app.",
          id: "QhJpjX",
        })}
      </Text>
      <Text mb>
        {intl.formatMessage({
          defaultMessage:
            "The master plan is to build a foundation for the Semantic Desktop - one unified UI for all your local-first data.",
          id: "lrqCiB",
        })}
      </Text>
      <View className="flex-row">
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
    </Layout>
  );
};

export default About;
