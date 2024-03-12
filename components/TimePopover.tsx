import { create, props } from "@stylexjs/stylex";
import { Function, ReadonlyArray } from "effect";
import {
  FC,
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { Temporal } from "temporal-polyfill";
import { colors, fontSizes, spacing } from "../lib/Tokens.stylex";
import { RNfW } from "../lib/Types";
import { Button } from "./Button";
import { Formatted } from "./Formatted";
import { PopoverContainer, PopoverFooter } from "./Popover";
import { Text } from "./Text";

export const TimePopover: FC<{
  initialValue: Temporal.PlainTime;
  onDone: (value: Temporal.PlainTime) => void;
  onCancel: () => void;
}> = ({ initialValue, onDone, onCancel }) => {
  const hoursScrollViewRef = useRef<HTMLDivElement>(null);
  const minutesScrollViewRef = useRef<HTMLDivElement>(null);
  const scrollViewsRef = useRef<HTMLDivElement>(null);

  const reset = useCallback(
    ({ animated }: { animated: boolean }) => {
      const { current: hoursScrollView } = hoursScrollViewRef;
      const { current: minutesScrollView } = minutesScrollViewRef;
      const { current: scrollViews } = scrollViewsRef;
      if (!hoursScrollView || !minutesScrollView || !scrollViews) return;
      const { offsetHeight } = scrollViews;
      hoursScrollView.scrollTo({
        y: (initialValue.hour * offsetHeight) / 5,
        animated,
      } as RNfW);
      minutesScrollView.scrollTo({
        y: (initialValue.minute * offsetHeight) / 5,
        animated,
      } as RNfW);
    },
    [initialValue.hour, initialValue.minute],
  );

  useLayoutEffect(() => {
    reset({ animated: false });
  }, [reset]);

  const [hour, setHour] = useState(initialValue.hour);
  const handleHoursScrollViewScroll = useCallback(
    ({
      nativeEvent: { contentOffset, layoutMeasurement },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setHour(
        Math.floor((contentOffset.y * 5) / layoutMeasurement.height + 0.5),
      );
    },
    [],
  );

  const [minute, setMinute] = useState(initialValue.minute);
  const handleMinutesScrollViewScroll = useCallback(
    ({
      nativeEvent: { contentOffset, layoutMeasurement },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      setMinute(
        Math.floor((contentOffset.y * 5) / layoutMeasurement.height + 0.5),
      );
    },
    [],
  );

  return (
    <PopoverContainer>
      <div {...props(styles.strip)} />
      <div {...props(styles.gradient1)} />
      <div {...props(styles.gradient2)} />
      <div ref={scrollViewsRef} {...props(styles.scrollViews)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView as RNfW}
          // @ts-expect-error RNfW
          tabIndex={0}
          ref={hoursScrollViewRef as RNfW}
          onScroll={handleHoursScrollViewScroll}
          scrollEventThrottle={16}
        >
          <Spacer />
          <Hours />
          <Spacer />
        </ScrollView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView as RNfW}
          // @ts-expect-error RNfW
          tabIndex={0}
          ref={minutesScrollViewRef as RNfW}
          onScroll={handleMinutesScrollViewScroll}
          scrollEventThrottle={16}
        >
          <Spacer />
          <Minutes />
          <Spacer />
        </ScrollView>
      </div>
      <PopoverFooter>
        <Button title="Cancel" onPress={onCancel} />
        <Button
          title="Done"
          onPress={() => {
            onDone(new Temporal.PlainTime(hour, minute));
          }}
        />
      </PopoverFooter>
    </PopoverContainer>
  );
};

const Spacer = memo(function Spacer() {
  return (
    <>
      <div {...props(styles.spacer)} />
      <div {...props(styles.spacer)} />
    </>
  );
});

// TODO: Scroll on press.
const Hours = memo(function Hours() {
  return ReadonlyArray.makeBy(24, Function.identity).map((hour) => (
    <Text key={hour} style={styles.hour}>
      <Formatted value={`${hour}hours`} />
    </Text>
  ));
});

// TODO: Scroll on press.
const Minutes = memo(function Hours() {
  return ReadonlyArray.makeBy(60, Function.identity).map((minute) => (
    <Text key={minute} style={styles.minute}>
      <Formatted value={`${minute}minutes`} />
    </Text>
  ));
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
    height: `calc(5 * ${spacing.m})`,
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
  hour: {
    fontSize: fontSizes.step2,
    scrollSnapAlign: "start",
    paddingLeft: "3ch",
    paddingRight: "1.5ch",
  },
  minute: {
    fontSize: fontSizes.step2,
    scrollSnapAlign: "start",
    paddingLeft: "1.5ch",
    paddingRight: "3ch",
  },
});
