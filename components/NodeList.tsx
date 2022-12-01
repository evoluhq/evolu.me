import { useIntl } from "react-intl";
import { View } from "./styled";
import { Text } from "./Text";

export const NodeList = () => {
  const intl = useIntl();

  // TODO: A space for scrolling.
  //  className="py-[132px]" // 3x44

  return (
    <View>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      {/* <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text>
      <Text className="text-center">
        {intl.formatMessage({
          defaultMessage: "Here will be your thoughts, organized.",
          id: "9Udtvr",
        })}
      </Text> */}
    </View>
  );
};
