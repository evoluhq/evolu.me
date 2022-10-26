import { FC } from "react";
import { Pressable, Text, View } from "./styled";

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
    <View className="flex-row gap-4">
      <Button title="All" />
      <Button title="…" />
      {/* <Button title="⊕" /> */}
      {/* <Pressable className="place-self-center">
        <Text className="text-xl text-gray-900 dark:text-gray-200">
          <svg
            // TODO: Make a component for this.
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Text>
      </Pressable>
      <Button
        title="Reset"
        onPress={() => {
          // resetOwner();
        }}
      /> */}
    </View>
  );
};
