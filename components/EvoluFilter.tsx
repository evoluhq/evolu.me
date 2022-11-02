import { FC } from "react";
import { View as RnView } from "react-native";
import { focusNativeId, nativeId } from "../lib/focusNativeId";
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
      ArrowUp: focusNativeId("createEvoluInput"),
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
              title="all"
              x={0}
              focusable={x === 0}
              nativeID={nativeId.firstFilterButton}
            />
            <Button title="…" x={1} focusable={x === 1} />
          </>
        )}
      </KeyboardNavigationProvider>
    </View>
  );
};
