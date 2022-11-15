import { FC } from "react";
import { View as RnView } from "react-native";
import { uniqueId } from "../lib/uniqueId";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/useKeyNavigation";
import { Button, ButtonProps } from "./Button";
import { ScrollView } from "./styled";
import { T } from "./T";

const FilterButton: FC<ButtonProps & { x: number; isLast: boolean }> = ({
  x,
  isLast,
  ...props
}) => {
  const keyNavigation = useKeyNavigation<RnView>({
    x,
    keys: {
      ArrowRight: !isLast ? "nextX" : { id: uniqueId.mainNavButton },
      ArrowLeft: "previousX",
      ArrowUp: { id: uniqueId.createEvoluInput },
    },
  });
  return <Button {...keyNavigation} {...props} />;
};

export const EvoluFilter = () => {
  // const example = ["all", "evolu", "dev", "footer", "…"];
  const example = ["all", "…"];

  return (
    <ScrollView horizontal>
      <KeyboardNavigationProvider maxX={example.length - 1}>
        {({ x }) => (
          <>
            {example.map((title, i) => (
              <FilterButton
                key={title}
                focusable={i === x}
                x={i}
                isLast={i === example.length - 1}
                nativeID={
                  i === 0
                    ? uniqueId.firstFilterButton
                    : i === example.length - 1
                    ? uniqueId.lastFilterButton
                    : undefined
                }
              >
                <T v="tb">{title}</T>
              </FilterButton>
            ))}
          </>
        )}
      </KeyboardNavigationProvider>
    </ScrollView>
  );
};
