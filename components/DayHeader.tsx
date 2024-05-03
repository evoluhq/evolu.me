import { create, keyframes, props } from "@stylexjs/stylex";
import { Array, identity } from "effect";
import { memo, useCallback, useContext, useLayoutEffect, useRef } from "react";
import { Temporal } from "temporal-polyfill";
import { atDistance, colors, spacing, transitions } from "../lib/Tokens.stylex";
import { IntlContext } from "../lib/contexts/IntlContext";
import { NowContext } from "../lib/contexts/NowContext";
import { UiStateContext } from "../lib/contexts/UiStateContext";
import { useGetDayUrl } from "../lib/hooks/useGetDayUrl";
import {
  Carousel,
  CarouselOffset,
  decodeSyncCarouselOffset,
  offsetReference,
} from "./Carousel";
import { Link } from "./Link";
import { WeekDayGrid } from "./WeekDayGrid";
import { WeekGrid } from "./WeekGrid";

interface DayWeek {
  date: Temporal.PlainDate;
  onSnap: (offset: CarouselOffset) => void;
}

export const DayHeader = memo<DayWeek>(function DayHeader({ date, onSnap }) {
  const intl = useContext(IntlContext);
  const uiState = useContext(UiStateContext);
  return (
    <>
      <WeekDayGrid weekday="narrow" />
      <Carousel
        ref={uiState.dayWeek.carouselRef}
        getOffset={useCallback(() => {
          const { weeks } = intl
            .startOfWeek(date)
            .since(intl.startOfWeek(offsetReference), {
              largestUnit: "weeks",
            });
          return decodeSyncCarouselOffset(weeks);
        }, [date, intl])}
        renderItem={useCallback(
          (offset: number) => (
            <Dates date={date} offset={offset} />
          ),
          [date],
        )}
        onSnap={onSnap}
        style={styles.carousel}
      />
    </>
  );
});

const Dates = memo<{
  date: Temporal.PlainDate;
  offset: number;
}>(function Dates({ date, offset }) {
  const today = useContext(NowContext).plainDateISO();
  const intl = useContext(IntlContext);
  const startOfWeek = intl.startOfWeek(date).add({ weeks: offset });
  const days = Array.makeBy(7, identity).map((n) =>
    startOfWeek.add({ days: n }),
  );

  return (
    <WeekGrid>
      {days.map((day) => (
        <DateLink
          key={day.toString()}
          date={day}
          isToday={day.equals(today)}
          isSelected={day.equals(date)}
        />
      ))}
    </WeekGrid>
  );
});

const DateLink = memo<{
  date: Temporal.PlainDate;
  isToday: boolean;
  isSelected: boolean;
}>(
  function DateLink({ date, isToday, isSelected }) {
    const uiState = useContext(UiStateContext);
    const divRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (!isToday) return;
      const animation = divRef.current?.getAnimations()[0];
      if (animation) uiState.dayWeek.todayAttentionAnimation = animation;
      return () => {
        uiState.dayWeek.todayAttentionAnimation = null;
      };
    }, [isToday, uiState.dayWeek]);

    const getDayUrl = useGetDayUrl();
    const intl = useContext(IntlContext);

    return (
      <Link
        href={getDayUrl(date)}
        aria-label={intl.toLocaleString(date, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        style={styles.link}
        hoverStyle={styles.linkHover}
        tabIndex={-1} // TODO: Use "roving tabindex"
      >
        {({ hovered }) => (
          <div
            ref={divRef}
            {...props([
              styles.linkWrapper,
              isToday && styles.today,
              isSelected ? styles.selected : hovered && styles.hovered,
              isToday && isSelected && styles.todaySelected,
            ])}
          >
            {date.day}
          </div>
        )}
      </Link>
    );
  },
  (prevProps, nextProps) =>
    prevProps.date.equals(nextProps.date) &&
    prevProps.isToday === nextProps.isToday &&
    prevProps.isSelected == nextProps.isSelected,
);

const attentionAnimation = keyframes({
  "0%, 100%": { transform: "translateX(0)" },
  "20%": { transform: `translateX(calc(${spacing.xxxs} * -1))` },
  "40%": { transform: `translateX(${spacing.xxxs})` },
  "60%": { transform: `translateX(calc(${spacing.xxxs} * -1))` },
  "80%": { transform: `translateX(${spacing.xxxs})` },
});

const styles = create({
  carousel: {
    flex: "none",
    // Reserve space for AllDay and Pinned Tags.
    paddingBottom: spacing.l,
  },
  link: {
    // "styling at a distance"
    // https://github.com/facebook/stylex/issues/250#issuecomment-1868392679
    [atDistance.buttonBackgroundColor]: {
      default: null,
      ":focus-visible": colors.hoverAndFocusBackground,
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: spacing.l,
    userSelect: "none",
    WebkitUserSelect: "none",
  },
  linkHover: {
    textDecoration: "none",
  },
  linkWrapper: {
    textDecoration: "none",
    display: "grid",
    placeItems: "center",
    width: "3cap", // or 2.77?
    height: "3cap",
    padding: null,
    borderRadius: "50%",
    transition: transitions.color,
    backgroundColor: atDistance.buttonBackgroundColor,
  },
  today: {
    outlineStyle: "solid",
    outlineWidth: "1px",
    outlineColor: "currentcolor",
    outlineOffset: -1,
    color: colors.secondary,
    animationName: attentionAnimation,
    animationTimingFunction: "ease-out",
    animationPlayState: "paused",
    animationDuration: ".5s",
  },
  selected: {
    color: colors.background,
    backgroundColor: colors.primary,
  },
  hovered: {
    backgroundColor: colors.hoverAndFocusBackground,
  },
  todaySelected: {
    outlineOffset: -2,
  },
});
