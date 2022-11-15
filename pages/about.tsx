/* eslint-disable formatjs/no-literal-string-in-jsx */
import { Layout } from "../components/Layout";
import { PageTitle } from "../components/PageTitle";
import { Text } from "../components/styled";
import { T } from "../components/T";
import { appDescription } from "../lib/appDescription";

const About = () => {
  return (
    <>
      <PageTitle title="About" />
      <Layout>
        <T v="p">{appDescription}</T>
        <T v="p">
          <Text
            // @ts-expect-errors RNfW
            href="https://twitter.com/steida"
            hrefAttrs={{ target: "blank" }}
            className="opacity-60"
          >
            Twitter
          </Text>{" "}
          <Text
            // @ts-expect-errors RNfW
            href="https://github.com/evoluhq/evolu.me"
            hrefAttrs={{ target: "blank" }}
            className="opacity-60"
          >
            GitHub
          </Text>
        </T>
      </Layout>
    </>
  );
};

export default About;
