import { StyleXStyles, create, props } from "@stylexjs/stylex";
import {
  FC,
  ReactNode,
  forwardRef,
  memo,
  useImperativeHandle,
  useRef,
} from "react";
import { Pressable, ScrollView } from "react-native";
import { colors, fontSizes, spacing } from "../lib/Tokens.stylex";
import { RNfW } from "../lib/Types";
import { Button } from "./Button";
import { PopoverContainer, PopoverFooter } from "./Popover";
import { Text } from "./Text";

const wheelPickerNumberOfVisibleItems = 5;

interface WheelPickerProps {
  children: ReactNode;
  onCancel: () => void;
  onDone: () => void;
}

export const WheelPicker = forwardRef<HTMLDivElement, WheelPickerProps>(
  function WheelPicker({ children, onCancel, onDone }, ref) {
    return (
      <PopoverContainer>
        <div {...props(styles.strip)} />
        <div {...props(styles.gradient1)} />
        <div {...props(styles.gradient2)} />
        <div ref={ref} {...props(styles.scrollViews)}>
          {children}
        </div>
        <PopoverFooter>
          <Button title="Cancel" onPress={onCancel} />
          <Button title="Done" onPress={onDone} />
        </PopoverFooter>
      </PopoverContainer>
    );
  },
);

export interface WheelPickerScrollViewRef {
  scrollTo: (options: { index: number; animated: boolean }) => void;
}

export const WheelPickerScrollView = forwardRef<
  WheelPickerScrollViewRef,
  {
    children: ReactNode;
    onScroll: (index: number) => void;
  }
>(function WheelPickerScrollView({ children, onScroll }, ref) {
  useImperativeHandle(
    ref,
    () => ({
      scrollTo({ index, animated }) {
        hoursScrollViewRef.current?.scrollTo({
          y:
            (index * hoursScrollViewRef.current.offsetHeight) /
            wheelPickerNumberOfVisibleItems,
          animated,
        } as RNfW);
      },
    }),
    [],
  );

  const hoursScrollViewRef = useRef<HTMLDivElement>(null);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.scrollView as RNfW}
      // @ts-expect-error RNfW......
      tabIndex={0}
      ref={hoursScrollViewRef as RNfW}
      onScroll={({ nativeEvent: { contentOffset, layoutMeasurement } }) => {
        onScroll(
          Math.floor(
            (contentOffset.y * wheelPickerNumberOfVisibleItems) /
              layoutMeasurement.height +
              0.5,
          ),
        );
      }}
      scrollEventThrottle={16}
    >
      <Spacer />
      {children}
      <Spacer />
    </ScrollView>
  );
});

export const WheelPickerItem: FC<{
  onPress: () => void;
  children: ReactNode;
  style?: StyleXStyles;
}> = ({ onPress, children, style }) => {
  return (
    <Pressable onPress={onPress}>
      <Text style={[styles.item, style || null]}>{children}</Text>
    </Pressable>
  );
};

const Spacer = memo(function WheelPickerSpacer() {
  return (
    <>
      <div {...props(styles.spacer)} />
      <div {...props(styles.spacer)} />
    </>
  );
});

const styles = create({
  strip: {
    position: "absolute",
    height: spacing.m,
    backgroundColor: colors.hoverAndFocusBackground,
    left: spacing.s,
    right: spacing.s,
    top: spacing.xl,
    borderRadius: spacing.xxxs,
    zIndex: 0,
  },
  gradient1: {
    position: "absolute",
    height: spacing.xl,
    backgroundImage: `linear-gradient(to bottom, ${colors.background} 5%, transparent 100%)`,
    backgroundColor: `color-mix(in srgb, ${colors.background} 50%, transparent 50%)`,
    left: spacing.s,
    right: spacing.s,
    top: 0,
    zIndex: 1,
    pointerEvents: "none",
  },
  gradient2: {
    position: "absolute",
    height: spacing.xl,
    backgroundImage: `linear-gradient(to top, ${colors.background} 5%, transparent 100%)`,
    backgroundColor: `color-mix(in srgb, ${colors.background} 50%, transparent 50%)`,
    left: spacing.s,
    right: spacing.s,
    top: `calc(${spacing.xl} + ${spacing.m})`,
    zIndex: 1,
    pointerEvents: "none",
  },
  scrollViews: {
    display: "flex",
    height: `calc(${wheelPickerNumberOfVisibleItems} * ${spacing.m})`,
  },
  scrollView: {
    scrollSnapType: "y mandatory",
    userSelect: "none",
    WebkitUserSelect: "none",
    outline: "none",
  },
  spacer: {
    height: spacing.m,
    scrollSnapAlign: "start",
  },
  item: {
    fontSize: fontSizes.step2,
    scrollSnapAlign: "start",
  },
});

export const wheelPickerItemStyles = create({
  left: {
    paddingLeft: "3ch",
    paddingRight: "1.5ch",
  },
  right: {
    paddingLeft: "1.5ch",
    paddingRight: "3ch",
  },
});
