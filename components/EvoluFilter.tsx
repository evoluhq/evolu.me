import { FC } from "react";
import { View as RnView } from "react-native";
import { domFocus, domId } from "../lib/domId";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/useKeyNavigation";
import { Pressable, Text, View } from "./styled";

const Button: FC<{
  title: string;
  onPress?: () => void;
  x: number;
  focusable: boolean;
  nativeID?: string;
}> = ({ title, onPress, x, focusable, nativeID }) => {
  const keyNavigation = useKeyNavigation<RnView>({
    x,
    keys: {
      ArrowRight: "nextX",
      ArrowLeft: "previousX",
      ArrowUp: domFocus("createEvoluInput"),
    },
  });

  return (
    <Pressable
      {...keyNavigation}
      focusable={focusable}
      onPress={onPress}
      className="rounded-sm px-2 focus:outline-none focus-visible:ring-2"
      {...(nativeID && { nativeID })}
    >
      <Text className="text-xl text-gray-900 dark:text-gray-200">{title}</Text>
    </Pressable>
  );
};

export const EvoluFilter = () => {
  return (
    <View className="-ml-2 flex-row">
      <KeyboardNavigationProvider maxX={1}>
        {({ x }) => (
          <>
            <Button
              title="All"
              x={0}
              focusable={x === 0}
              nativeID={domId.firstFilterButton}
            />
            <Button title="…" x={1} focusable={x === 1} />
          </>
        )}
      </KeyboardNavigationProvider>
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
