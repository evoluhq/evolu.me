import * as S from "@effect/schema/Schema";
import { StyleXStyles, create, props } from "@stylexjs/stylex";
import { Number, ReadonlyArray } from "effect";
import {
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import { RNfW } from "../lib/Types";
import { Temporal } from "temporal-polyfill";

// TODO: Accessibility.
// https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
// https://splidejs.com/guides/accessibility/#overview
// https://www.smashingmagazine.com/2023/02/guide-building-accessible-carousels/
// https://react-spectrum.adobe.com/blog/date-and-time-pickers-for-all.html

export interface CarouselRef {
  scrollToCenter: () => void;
  isCentered: () => boolean;
}

export const CarouselOffset = S.number.pipe(S.int(), S.brand("CarouselOffset"));
export type CarouselOffset = S.Schema.To<typeof CarouselOffset>;

export const decodeSyncCarouselOffset = S.decodeSync(CarouselOffset);
export const initialCarouselOffset = decodeSyncCarouselOffset(0);

/**
 * The UNIX epoch used for computing an offset.
 *
 * TODO: Check older dates to see whether they work.
 */
export const offsetReference = Temporal.PlainDate.from("1970-01-01");

export interface CarouselProps {
  /** It must return a unique CarouselOffset representing rendered data. */
  getOffset: () => CarouselOffset;
  renderItem: (offset: CarouselOffset, isVisible: boolean) => ReactNode;
  onSnap: (offset: CarouselOffset) => void;
  style?: StyleXStyles;
  contentContainerStyle?: StyleXStyles;
  childContainerStyle?: StyleXStyles;
  initialSnapCount?: number;
}

/** Infinite bi-directional Carousel optimized for performance and UX. */
export const Carousel = forwardRef<CarouselRef, CarouselProps>(
  function Carousel(
    {
      getOffset,
      renderItem,
      onSnap,
      style,
      contentContainerStyle,
      childContainerStyle,
      // TODO: Smooth scroll for the last snap.
      initialSnapCount = 10,
    },
    ref,
  ) {
    const [infinityOffset, setInifinityOffset] = useState(0);

    const centerScrollView = (animated: boolean) => {
      const { current: scrollView } = scrollViewRef;
      if (!scrollView) return;
      scrollView.scrollTo({
        x: snapCountRef.current * scrollView.offsetWidth,
        animated,
      } as RNfW);
    };

    const scrollToCenter = useCallback(() => {
      const { current: scrollView } = scrollViewRef;
      if (!scrollView) return;
      if (infinityOffset === 0) {
        centerScrollView(true);
      } else {
        reset(() => 0);
      }
    }, [infinityOffset]);

    const isCentered = useCallback((): boolean => {
      const { current: scrollView } = scrollViewRef;
      if (!scrollView) return false;
      return (
        infinityOffset === 0 &&
        Math.abs(
          scrollView.scrollWidth / 2 -
            (scrollView.scrollLeft + scrollView.offsetWidth / 2),
        ) < 2
      );
    }, [infinityOffset]);

    useImperativeHandle(ref, () => ({ scrollToCenter, isCentered }), [
      isCentered,
      scrollToCenter,
    ]);

    const scrollViewRef = useRef<HTMLDivElement>(null);
    const [scrollViewKey, setScrollViewKey] = useState(0);
    const snapCountRef = useRef(initialSnapCount);
    const totalSnapCountRef = useRef(initialSnapCount * 2 + 1);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [diffOffset, setDiffOffset] = useState(0);

    const [previousGetOffset, setPreviousGetOffset] = useState(() => getOffset);
    const currentGetOffset = useMemo(() => getOffset, [getOffset]);

    const reset = (infinityOffset: (n: number) => number) => {
      setScrollViewKey(Number.increment);
      setScrollOffset(0);
      setDiffOffset(0);
      setInifinityOffset(infinityOffset);
    };

    /**
     * New getOffset means new underlying data, and we want to preserve the
     * current scroll position, if possible. If not, we have to reset.
     * https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
     */
    if (currentGetOffset !== previousGetOffset) {
      setPreviousGetOffset(() => currentGetOffset);
      const currentOffset = currentGetOffset();
      const previousOffset = previousGetOffset();
      const nextDiffOffset =
        diffOffset + currentOffset - previousOffset + infinityOffset;
      setDiffOffset(nextDiffOffset);
      if (nextDiffOffset !== scrollOffset) {
        // TODO: Detect whether we can use animated scroll.
        reset(() => 0);
      }
    }

    useLayoutEffect(() => {
      centerScrollView(false);
    }, [scrollViewKey]);

    const previousNextScrollOffsetRef = useRef<number>(0);

    const handleScroll = useCallback(
      ({
        nativeEvent: { contentOffset, layoutMeasurement },
      }: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (contentOffset.x === 0 || layoutMeasurement.width === 0) return;

        const nextScrollOffset = Math.floor(
          contentOffset.x / layoutMeasurement.width -
            snapCountRef.current +
            0.5,
        );

        if (previousNextScrollOffsetRef.current === nextScrollOffset) return;
        previousNextScrollOffsetRef.current = nextScrollOffset;

        onSnap(
          (nextScrollOffset - diffOffset + infinityOffset) as CarouselOffset,
        );

        if (Math.abs(nextScrollOffset) < snapCountRef.current) {
          setScrollOffset(nextScrollOffset);
        } else {
          reset((offset) => offset - diffOffset + nextScrollOffset);
        }
      },
      [diffOffset, infinityOffset, onSnap],
    );

    const offsetsRef = useRef<ReadonlyArray<number>>([]);
    const getOffsets = () => {
      if (offsetsRef.current.length === 0)
        offsetsRef.current = ReadonlyArray.makeBy(
          totalSnapCountRef.current,
          (i) => i - snapCountRef.current,
        );
      return offsetsRef.current;
    };

    const childContainerStylexProps = useMemo(
      () => props(styles.childContainer, childContainerStyle),
      [childContainerStyle],
    );

    const shouldRender = useMemo(
      () =>
        Number.between({
          minimum: scrollOffset - 1,
          maximum: scrollOffset + 1,
        }),
      [scrollOffset],
    );

    // "...you may add an early return; to restart rendering earlier."
    // https://react.dev/reference/react/useState#storing-information-from-previous-renders
    if (currentGetOffset !== previousGetOffset) return;

    return (
      <ScrollView
        key={scrollViewKey}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.scrollView as RNfW, style as RNfW]}
        contentContainerStyle={[
          styles.contentContainer(totalSnapCountRef.current) as RNfW,
          contentContainerStyle as RNfW,
        ]}
        ref={scrollViewRef as RNfW}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {getOffsets().map((offset) => (
          <div key={offset} {...childContainerStylexProps}>
            {shouldRender(offset) &&
              renderItem(
                (offset - diffOffset + infinityOffset) as CarouselOffset,
                offset === scrollOffset,
              )}
          </div>
        ))}
      </ScrollView>
    );
  },
);

const styles = create({
  scrollView: {
    scrollSnapType: "x mandatory",
    overscrollBehavior: "contain",
  },
  contentContainer: (itemsLength: number) => ({
    /**
     * Why we use CSS Grid instead of absolutely positioned elements: "React
     * preserves a component’s state for as long as it’s being rendered at its
     * position in the UI tree. If it gets removed, or a different component
     * gets rendered at the same position, React discards its state."
     * https://react.dev/learn/preserving-and-resetting-state
     */
    display: "grid",
    width: `${itemsLength}00%`,
    gridTemplateColumns: `repeat(${itemsLength}, 1fr)`,
  }),
  childContainer: {
    overflowX: "hidden", // Ensure that the column width stays fixed even if the content is wider.
    scrollSnapAlign: "start", // Snaps must be prerendered to work.
    scrollSnapStop: "always",
    height: "100%", // To allow children to have bounded height.
  },
});
