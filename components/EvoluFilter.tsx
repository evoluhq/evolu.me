import { resetOwner } from "evolu";
import { FC } from "react";
import { Pressable, Text, View } from "react-native";

const Button: FC<{ title: string; onPress?: () => void }> = ({
  title,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress}>
      <Text className="text-xl text-gray-900 dark:text-gray-200">{title}</Text>
    </Pressable>
  );
};

export const EvoluFilter = () => {
  return (
    <View className="flex-row justify-between gap-4">
      <Button title="All" />
      <Button
        title="Reset"
        onPress={() => {
          resetOwner();
        }}
      />
    </View>
  );
};
