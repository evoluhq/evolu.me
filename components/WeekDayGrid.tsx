import { create } from "@stylexjs/stylex";
import { ReadonlyArray } from "effect";
import { memo, useContext } from "react";
import { Temporal } from "temporal-polyfill";
import { colors, fontSizes, spacing } from "../lib/Tokens.stylex";
import { IntlContext } from "../lib/contexts/IntlContext";
import { EnsureBaseline } from "./EnsureBaseline";
import { Text } from "./Text";
import { WeekGrid } from "./WeekGrid";

export const WeekDayGrid = memo<{ weekday: "narrow" | "short" }>(
  function WeekDayGrid({ weekday }) {
    const intl = useContext(IntlContext);
    const date = intl.startOfWeek(Temporal.PlainDate.from("1970-01-01"));

    return (
      <WeekGrid>
        {ReadonlyArray.makeBy(7, (i) => {
          const day = date.add({ days: i });
          return (
            <Text
              aria-hidden
              key={i}
              style={[styles.day, weekday === "short" && styles.short]}
            >
              {intl.toLocaleString(day, { weekday })}
              <EnsureBaseline style={styles.ensureBaseline} />
            </Text>
          );
        })}
      </WeekGrid>
    );
  },
);

const styles = create({
  day: {
    textAlign: "center",
    userSelect: "none",
    WebkitUserSelect: "none",
    fontWeight: "bold",
    fontSize: fontSizes.step_2,
    lineHeight: spacing.s as unknown as number,
    height: spacing.s,
  },
  short: {
    color: colors.secondary,
    textTransform: "uppercase",
  },
  ensureBaseline: {
    lineHeight: spacing.s as unknown as number,
  },
});
