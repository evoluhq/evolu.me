/* eslint-disable formatjs/no-literal-string-in-jsx */
import { useIntl } from "react-intl";
import { Pressable, View } from "./styled";
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
      <Pressable className="focus:bg-red-400">
        <Text>focus:bg-red-400</Text>
      </Pressable>
      <Pressable className="focus-visible:bg-red-400">
        <Text>focus-visible:bg-red-400</Text>
      </Pressable>
      <Pressable className="hover:bg-red-400">
        <Text>hover:bg-red-400</Text>
      </Pressable>
      <Pressable className="hocus:bg-red-400">
        <Text>hocus:bg-red-400</Text>
      </Pressable>
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
