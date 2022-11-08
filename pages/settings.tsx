import { useIntl } from "react-intl";
import { Layout } from "../components/Layout";
import { PageTitle } from "../components/PageTitle";
import { Paragraph } from "../components/Paragraph";

const Settings = () => {
  const intl = useIntl();

  return (
    <>
      <PageTitle title="Settings" />
      <Layout>
        <Paragraph>
          {intl.formatMessage({ defaultMessage: "Settings", id: "D3idYv" })}
        </Paragraph>
      </Layout>
    </>
  );
};

export default Settings;
