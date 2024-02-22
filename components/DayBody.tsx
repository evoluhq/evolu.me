import { create } from "@stylexjs/stylex";
import { useRouter } from "next/router";
import { memo, useCallback } from "react";
import { ScrollView } from "react-native";
import { Temporal } from "temporal-polyfill";
import { RNfW } from "../lib/Types";
import { useGetDayUrl } from "../lib/hooks/useGetDayUrl";
import {
  Carousel,
  CarouselOffset,
  decodeSyncCarouselOffset,
  offsetReference,
} from "./Carousel";
import { DayAddNote } from "./DayAddNote";
import { DayNotes } from "./DayNotes";

export const DayBody = memo<{
  date: Temporal.PlainDate;
}>(function DayNotes({ date }) {
  const router = useRouter();
  const getDayUrl = useGetDayUrl();

  const handleSnap = useCallback(
    (offset: number) => {
      const nextDate = date.add({ days: offset });
      void router.push(getDayUrl(nextDate));
    },
    [date, getDayUrl, router],
  );

  return (
    <Carousel
      getOffset={useCallback(() => {
        const { days } = date.since(offsetReference, { largestUnit: "days" });
        return decodeSyncCarouselOffset(days);
      }, [date])}
      renderItem={useCallback(
        (offset: CarouselOffset, isVisible: boolean) => (
          <CarouselItem
            day={date.add({ days: offset })}
            isVisible={isVisible}
          />
        ),
        [date],
      )}
      onSnap={handleSnap}
    />
  );
});

const CarouselItem = memo<{
  day: Temporal.PlainDate;
  isVisible: boolean;
}>(
  function CarouselItem({ day, isVisible }) {
    return (
      <ScrollView
        style={styles.scrollView as RNfW}
        showsVerticalScrollIndicator={false}
      >
        <DayNotes day={day} isVisible={isVisible} />
        <DayAddNote day={day} isVisible={isVisible} />
      </ScrollView>
    );
  },
  (prevProps, nextProps) =>
    prevProps.day.equals(nextProps.day) &&
    prevProps.isVisible === nextProps.isVisible,
);

const styles = create({
  scrollView: {
    height: "100%", // The parent isn't flex.
  },
});
