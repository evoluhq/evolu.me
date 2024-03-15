import { Function, ReadonlyArray } from "effect";
import {
  FC,
  memo,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Temporal } from "temporal-polyfill";
import { Formatted } from "./Formatted";
import {
  WheelPicker,
  WheelPickerItem,
  wheelPickerItemStyles,
  WheelPickerScrollView,
  WheelPickerScrollViewRef,
} from "./WheelPicker";

export const TimePopover: FC<{
  initialValue: Temporal.PlainTime;
  onDone: (value: Temporal.PlainTime) => void;
  onCancel: () => void;
}> = ({ initialValue, onDone, onCancel }) => {
  const initialRoundedValue = roundPlainTimeToNearestMultiple(initialValue);

  const hoursScrollViewRef = useRef<WheelPickerScrollViewRef>(null);
  const minutesScrollViewRef = useRef<WheelPickerScrollViewRef>(null);

  const [hour, setHour] = useState(initialRoundedValue.hour);
  const [minute, setMinute] = useState(initialRoundedValue.minute);

  const reset = useCallback(
    ({
      animated,
      hour,
      minute,
    }: {
      animated: boolean;
      hour?: number;
      minute?: number;
    }) => {
      if (hour != null)
        hoursScrollViewRef.current?.scrollTo({ index: hour, animated });
      if (minute != null)
        minutesScrollViewRef.current?.scrollTo({
          index: minute / minuteRoundingMultiple,
          animated,
        });
    },
    [],
  );

  useLayoutEffect(() => {
    reset({
      animated: false,
      hour: initialRoundedValue.hour,
      minute: initialRoundedValue.minute,
    });
  }, [initialRoundedValue.hour, initialRoundedValue.minute, reset]);

  return (
    <WheelPicker
      onCancel={onCancel}
      onDone={() => {
        onDone(new Temporal.PlainTime(hour, minute));
      }}
    >
      <WheelPickerScrollView ref={hoursScrollViewRef} onScroll={setHour}>
        <Hours
          onPress={useCallback(
            (hour: number) => {
              reset({ animated: true, hour });
            },
            [reset],
          )}
        />
      </WheelPickerScrollView>
      <WheelPickerScrollView
        ref={minutesScrollViewRef}
        onScroll={useCallback((index: number) => {
          setMinute(index * minuteRoundingMultiple);
        }, [])}
      >
        <Minutes
          onPress={useCallback(
            (minute: number) => {
              reset({ animated: true, minute });
            },
            [reset],
          )}
        />
      </WheelPickerScrollView>
    </WheelPicker>
  );
};

const minuteRoundingMultiple = 5;

const roundPlainTimeToNearestMultiple = (time: Temporal.PlainTime) => {
  const totalMinutes = time.hour * 60 + time.minute;
  const roundedMinutes =
    Math.round(totalMinutes / minuteRoundingMultiple) * minuteRoundingMultiple;
  return Temporal.PlainTime.from({
    hour: Math.floor(roundedMinutes / 60),
    minute: roundedMinutes % 60,
  });
};

const Hours = memo<{
  onPress: (hour: number) => void;
}>(function Hours({ onPress }) {
  return ReadonlyArray.makeBy(24, Function.identity).map((hour) => (
    <WheelPickerItem
      key={hour}
      onPress={() => {
        onPress(hour);
      }}
      style={wheelPickerItemStyles.left}
    >
      <Formatted value={`${hour}hours`} />
    </WheelPickerItem>
  ));
});

const Minutes = memo<{
  onPress: (hour: number) => void;
}>(function Hours({ onPress }) {
  return ReadonlyArray.makeBy(
    60 / minuteRoundingMultiple,
    (n) => n * minuteRoundingMultiple,
  ).map((minute) => (
    <WheelPickerItem
      key={minute}
      onPress={() => {
        onPress(minute);
      }}
      style={wheelPickerItemStyles.right}
    >
      <Formatted value={`${minute}minutes`} />
    </WheelPickerItem>
  ));
});
