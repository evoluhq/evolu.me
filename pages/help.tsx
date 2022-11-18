import { useIntl } from "react-intl";
import { Layout } from "../components/Layout";
import { PageTitle } from "../components/PageTitle";
import { T } from "../components/T";

const About = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle title="Help" />
      <Layout>
        <T v="p">
          {intl.formatMessage({
            defaultMessage: "TODO: How to use it and key navigation.",
            id: "6KOmUh",
          })}
        </T>
      </Layout>
    </>
  );
};

export default About;
