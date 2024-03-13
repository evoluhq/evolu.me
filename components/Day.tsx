import * as S from "@effect/schema/Schema";
import { create, props } from "@stylexjs/stylex";
import Head from "next/head";
import { FC, memo, useContext, useMemo, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { PlainDateFromUrlString } from "../lib/Routing";
import { consts, spacing } from "../lib/Tokens.stylex";
import { IntlContext } from "../lib/contexts/IntlContext";
import { NowContext } from "../lib/contexts/NowContext";
import { Button } from "./Button";
import { initialCarouselOffset } from "./Carousel";
import { DayBody } from "./DayBody";
import { DayFooter } from "./DayFooter";
import { DayHeader } from "./DayHeader";
import { RouterQuery } from "./RouterQuery";

/** Day is rendered as Next.js Layout to preserve the state. */
export const Layout: FC = () => (
  <RouterQuery schema={DayProps} render={(props) => <Day {...props} />} />
);

const DayProps = S.struct({ date: S.optional(PlainDateFromUrlString) });
type DayProps = S.Schema.To<typeof DayProps>;

const Day: FC<DayProps> = ({ date: _date }) => {
  const now = useContext(NowContext);
  const intl = useContext(IntlContext);

  const date = useMemo(() => _date || now.plainDateISO(), [now, _date]);
  const [carouselOffset, setCarouselOffset] = useState(initialCarouselOffset);

  const monthButtonDate = useMemo(
    () => date.add({ weeks: carouselOffset }),
    [carouselOffset, date],
  );

  // Carousel has a state that must be reset when a date changes.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [previousDate, setPreviousDate] = useState(date);
  if (!date.equals(previousDate)) {
    setPreviousDate(date);
    setCarouselOffset(initialCarouselOffset);
    // "...you may add an early return; to restart rendering earlier."
    // https://react.dev/reference/react/useState#storing-information-from-previous-renders
    return;
  }

  return (
    <>
      <Head>
        <title>
          {intl.toLocaleString(date, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })}{" "}
          | Evolu.me
        </title>
      </Head>
      <MonthButton
        date={monthButtonDate}
        showBothMonths={carouselOffset !== 0}
      />
      <div {...props(styles.centered)}>
        <DayHeader date={date} onSnap={setCarouselOffset} />
        <DayBody date={date} />
        <DayFooter date={date} />
      </div>
    </>
  );
};

const MonthButton = memo<{
  date: Temporal.PlainDate;
  showBothMonths: boolean;
}>(function DayMonthButton({ date, showBothMonths }) {
  const intl = useContext(IntlContext);

  const startOfWeek = intl.startOfWeek(date);
  const endOfWeek = intl.startOfWeek(date).add({ days: 6 });

  const title =
    showBothMonths && startOfWeek.month !== endOfWeek.month
      ? `${intl.toLocaleString(startOfWeek, { month: "long" })} / ${intl.toLocaleString(endOfWeek, { month: "long" })}`
      : intl.toLocaleString(date, { month: "long" });

  return (
    <Button
      title={title}
      style={styles.monthButtonPressable}
      titleStyle={styles.monthButtonTitle}
      disabled
    />
  );
});

const styles = create({
  centered: {
    width: "100%",
    maxWidth: consts.maxWidth,
    marginInline: "auto",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    /** It can't be bigger because seven buttons wouldn't fit on a 320px screen. */
    paddingInline: spacing.xxxs,
    minHeight: 0, // https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/#the-minimum-size-gotcha-11
  },
  monthButtonPressable: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    top: 0,
  },
  monthButtonTitle: {
    fontVariant: "small-caps",
    // letterSpacing: 1, maybe
  },
});
