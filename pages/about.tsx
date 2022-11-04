import { useIntl } from "react-intl";
import { Text, View } from "../components/styled";

const About = () => {
  const intl = useIntl();

  return (
    <View>
      <Text>
        {intl.formatMessage({
          defaultMessage: "about",
          id: "iITGlU",
        })}
      </Text>
    </View>
  );
};

export default About;
