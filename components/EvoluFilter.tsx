import { FC } from "react";
import { View as RnView } from "react-native";
import { focusNativeId, nativeId } from "../lib/focusNativeId";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/useKeyNavigation";
import { ScrollView } from "./styled";
import { TextButton, TextButtonProps } from "./TextButton";

const FilterButton: FC<TextButtonProps & { x: number }> = ({ x, ...props }) => {
  const keyNavigation = useKeyNavigation<RnView>({
    x,
    keys: {
      ArrowRight: "nextX",
      ArrowLeft: "previousX",
      ArrowUp: focusNativeId("createEvoluInput"),
    },
  });

  return <TextButton {...keyNavigation} {...props} />;
};

export const EvoluFilter = () => {
  const example = ["all", "evolu", "dev", "footer", "…"];

  return (
    <ScrollView
      horizontal
      // Ensure focus ring is visible.
      className="p-[2px]"
    >
      <KeyboardNavigationProvider maxX={example.length - 1}>
        {({ x }) => (
          <>
            {example.map((title, i) => (
              <FilterButton
                key={title}
                title={title}
                focusable={i === x}
                x={i}
                {...(i === 0 && { nativeID: nativeId.firstFilterButton })}
              />
            ))}
          </>
        )}
      </KeyboardNavigationProvider>
    </ScrollView>
  );
};
