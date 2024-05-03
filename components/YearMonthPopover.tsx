import { Array } from "effect";
import {
  FC,
  memo,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Temporal } from "temporal-polyfill";
import { IntlContext } from "../lib/contexts/IntlContext";
import {
  WheelPicker,
  WheelPickerItem,
  WheelPickerScrollView,
  WheelPickerScrollViewRef,
  wheelPickerItemStyles,
} from "./WheelPicker";

/** TODO: Support other than iso8601 calendars. */
export const YearMonthPopover: FC<{
  initialValue: Temporal.PlainYearMonth;
  onDone: (value: Temporal.PlainYearMonth) => void;
  onCancel: () => void;
}> = ({ initialValue, onDone, onCancel }) => {
  const monthsScrollViewRef = useRef<WheelPickerScrollViewRef>(null);
  const yearsScrollViewRef = useRef<WheelPickerScrollViewRef>(null);

  const [month, setMonth] = useState(initialValue.month);
  const [year, setYear] = useState(initialValue.year);

  const reset = useCallback(
    ({
      animated,
      month,
      year,
    }: {
      animated: boolean;
      month?: number;
      year?: number;
    }) => {
      if (month != null)
        monthsScrollViewRef.current?.scrollTo({ index: month - 1, animated });
      if (year != null)
        yearsScrollViewRef.current?.scrollTo({
          index: year - yearsStart + yearsOffset,
          animated,
        });
    },
    [],
  );

  useLayoutEffect(() => {
    reset({
      animated: false,
      month: initialValue.month,
      year: initialValue.year,
    });
  }, [initialValue.month, initialValue.year, reset]);

  return (
    <WheelPicker
      onCancel={onCancel}
      onDone={() => {
        onDone(new Temporal.PlainYearMonth(year, month));
      }}
    >
      <WheelPickerScrollView
        ref={monthsScrollViewRef}
        onScroll={useCallback((index) => {
          setMonth(index + 1);
        }, [])}
      >
        <Months
          onPress={useCallback(
            (index: number) => {
              reset({ animated: true, month: index + 1 });
            },
            [reset],
          )}
        />
      </WheelPickerScrollView>
      <WheelPickerScrollView
        ref={yearsScrollViewRef}
        onScroll={useCallback((index: number) => {
          setYear(index + yearsStart - yearsOffset);
        }, [])}
      >
        <Years
          onPress={useCallback(
            (index: number) => {
              reset({
                animated: true,
                year: index + yearsStart - yearsOffset,
              });
            },
            [reset],
          )}
        />
      </WheelPickerScrollView>
    </WheelPicker>
  );
};

const Months = memo<{
  onPress: (index: number) => void;
}>(function Months({ onPress }) {
  const intl = useContext(IntlContext);
  return Array.makeBy(12, (index) => {
    const date = Temporal.PlainDate.from({
      year: 2024,
      month: index + 1,
      day: 1,
    });
    const monthName = intl.toLocaleString(date, { month: "long" });

    return (
      <WheelPickerItem
        key={index}
        onPress={() => {
          onPress(index);
        }}
        style={wheelPickerItemStyles.left}
      >
        {monthName}
      </WheelPickerItem>
    );
  });
});

const yearsStart = 2024;
const yearsOffset = 10;

// TODO: Use Carousel with vertical feature.
const Years = memo<{
  onPress: (hour: number) => void;
}>(function Years({ onPress }) {
  return Array.makeBy(100, (index) => (
    <WheelPickerItem
      key={index}
      onPress={() => {
        onPress(index);
      }}
      style={wheelPickerItemStyles.right}
    >
      {index + yearsStart - yearsOffset}
    </WheelPickerItem>
  ));
});
