import { create } from "@stylexjs/stylex";
import { ReadonlyArray } from "effect";
import {
  FC,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { Temporal } from "temporal-polyfill";
import { colors, consts, spacing } from "../lib/Tokens.stylex";
import { IntlContext } from "../lib/contexts/IntlContext";
import { NowContext } from "../lib/contexts/NowContext";
import { Button } from "./Button";
import {
  Carousel,
  CarouselRef,
  decodeSyncCarouselOffset,
  initialCarouselOffset,
  offsetReference,
} from "./Carousel";
import { PopoverContainer, PopoverFooter, PopoverHeader } from "./Popover";
import { PopoverButtonProps } from "./PopoverButton";
import { WeekDayGrid } from "./WeekDayGrid";
import { WeekGrid } from "./WeekGrid";

export type DatePopoverButtonProps = Omit<
  PopoverButtonProps,
  "title" | "renderPopover"
> & {
  value: Temporal.PlainDate;
  onChange: (value: Temporal.PlainDate) => void;
};

export const DatePopover: FC<{
  initialValue: Temporal.PlainDate;
  onDone: (value: Temporal.PlainDate) => void;
}> = ({ initialValue, onDone }) => {
  const intl = useContext(IntlContext);
  const [value, setValue] = useState(initialValue);
  const carouselRef = useRef<CarouselRef>(null);

  const [carouselOffset, setCarouselOffset] = useState(initialCarouselOffset);

  const handleResetPress = useCallback(() => {
    setValue(initialValue);
    setCarouselOffset(initialCarouselOffset);
    const { current: carousel } = carouselRef;
    if (!carousel) return;
    if (!carousel.isCentered()) carousel.scrollToCenter();
  }, [initialValue]);

  const handleDonePress = useCallback(() => {
    onDone(value);
  }, [onDone, value]);

  const handleDatePress = useCallback((date: Temporal.PlainDate) => {
    setValue((previousDate) =>
      date.equals(previousDate) ? previousDate : date,
    );
    setCarouselOffset(initialCarouselOffset);
  }, []);

  const monthYearButtonTitle = useMemo(
    () =>
      intl.toLocaleString(value.add({ months: carouselOffset }), {
        year: "numeric",
        month: "long",
      }),
    [carouselOffset, intl, value],
  );

  return (
    <PopoverContainer>
      <PopoverHeader>
        <Button
          title={monthYearButtonTitle}
          onPress={() => {
            alert("Not yet");
          }}
        />
      </PopoverHeader>
      <WeekDayGrid weekday="short" />
      <Carousel
        ref={carouselRef}
        getOffset={useCallback(() => {
          const { months } = startOfMonth(value).since(
            startOfMonth(offsetReference),
            { largestUnit: "months" },
          );
          return decodeSyncCarouselOffset(months);
        }, [value])}
        renderItem={useCallback(
          (offset: number) => (
            <Dates date={value} offset={offset} onDatePress={handleDatePress} />
          ),
          [handleDatePress, value],
        )}
        onSnap={setCarouselOffset}
        style={styles.carousel}
      />
      <PopoverFooter>
        <Button title="Reset" disabled={false} onPress={handleResetPress} />
        <Button title="Done" onPress={handleDonePress} />
      </PopoverFooter>
    </PopoverContainer>
  );
};

const Dates = memo<{
  date: Temporal.PlainDate;
  offset: number;
  onDatePress: (date: Temporal.PlainDate) => void;
}>(function Dates({ date, offset, onDatePress }) {
  const offsetDate = date.add({ months: offset });

  return (
    <WeekGrid forMonth>
      {ReadonlyArray.makeBy(offsetDate.daysInMonth, (i) => {
        const day = offsetDate.with({ day: i + 1 });
        const isSelected = day.equals(date);
        return (
          <DateButton
            key={day.toString()}
            date={day}
            isSelected={isSelected}
            onPress={onDatePress}
          />
        );
      })}
    </WeekGrid>
  );
});

const DateButton = memo<{
  date: Temporal.PlainDate;
  isSelected: boolean;
  onPress: (date: Temporal.PlainDate) => void;
}>(
  function Date({ date, isSelected, onPress }) {
    const today = useContext(NowContext).plainDateISO();
    const isToday = date.equals(today);

    const handlePress = () => {
      onPress(date);
    };

    return (
      <Button
        title={date.day.toString()}
        style={
          date.day === 1 && styles.gridColumnStart(date.dayOfWeek.toString())
        }
        titleStyle={[
          styles.buttonTitle,
          isToday && styles.today,
          isSelected && styles.selected,
          isToday && isSelected && styles.todaySelected,
        ]}
        titleHoverStyle={isSelected && styles.selected}
        titlePressedStyle={isSelected && styles.selected}
        onPress={handlePress}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.date.equals(nextProps.date) &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.onPress === nextProps.onPress,
);

const styles = create({
  carousel: {
    width: `calc(7 * ${consts.minimalHit})`,
  },
  gridColumnStart: (gridColumnStart: string) => ({
    gridColumnStart,
  }),
  // TODO: Make circle as big as in DayHeader.
  buttonTitle: {
    borderRadius: "50%",
    padding: null,
    margin: spacing.xxxs,
    width: spacing.m,
    lineHeight: spacing.m as unknown as number,
  },
  today: {
    outlineStyle: "solid",
    outlineWidth: "1px",
    outlineColor: "currentcolor",
    outlineOffset: -1,
    color: colors.inactive,
  },
  selected: {
    backgroundColor: colors.primary,
    color: colors.background,
  },
  todaySelected: {
    outlineOffset: -2,
  },
});

const startOfMonth = (date: Temporal.PlainDate): Temporal.PlainDate =>
  date.with({ day: 1 });
