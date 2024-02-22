import { create, props } from "@stylexjs/stylex";
import { FC, memo, useContext } from "react";
import { Temporal } from "temporal-polyfill";
import { IntlContext } from "../lib/contexts/IntlContext";

export interface FormattedProps {
  value: Temporal.PlainDate | Temporal.PlainTime | HoursOrMinutes;
}

type HoursOrMinutes = `${number}${"hours" | "minutes"}`;

export const Formatted = memo<FormattedProps>(function Formatted({ value }) {
  if (value instanceof Temporal.PlainDate) return <PlainDate value={value} />;
  if (value instanceof Temporal.PlainTime) return <PlainTime value={value} />;
  if (typeof value === "string") {
    const result = /^(\d+)(hours|minutes)$/.exec(value);
    if (!result) throw new Error("Invalid HoursOrMinutes format.");
    const [, number, unit] = result;
    switch (unit) {
      case "hours":
        return <Hour value={parseInt(number, 10)} />;
      case "minutes":
        return <Minute value={parseInt(number, 10)} />;
    }
  }
});

const PlainDate: FC<{ value: Temporal.PlainDate }> = ({ value }) => {
  return useContext(IntlContext).toLocaleString(value, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const PlainTime: FC<{ value: Temporal.PlainTime }> = ({ value }) => {
  /**
   * We can't reuse Hour and Minutes because Safari needs a solid text node to
   * render it correctly. '20:00' split to '20' and ':00' will render ':'
   * vertically moved by 2px for some reason.
   */
  const hour = value.hour.toString().padStart(2, "0");
  const minute = value.minute.toString().padStart(2, "0");
  return (
    <span {...props(styles.tabularNums)}>
      {hour.startsWith("0") ? (
        <>
          <span {...props(styles.invisibleZero)}>0</span>
          {`${hour.slice(1)}:${minute}`}
        </>
      ) : (
        `${hour}:${minute}`
      )}
    </span>
  );
};

const Hour: FC<{ value: number }> = ({ value }) => {
  const hourString = value.toString().padStart(2, "0");
  return (
    <span {...props(styles.tabularNums)}>
      {hourString.startsWith("0") ? (
        <>
          <span {...props(styles.invisibleZero)}>0</span>
          {hourString.slice(1)}
        </>
      ) : (
        value
      )}
    </span>
  );
};

const Minute: FC<{ value: number }> = ({ value }) => {
  return (
    <span {...props(styles.tabularNums)}>
      {value.toString().padStart(2, "0")}
    </span>
  );
};

const styles = create({
  tabularNums: {
    fontVariantNumeric: "tabular-nums",
  },
  invisibleZero: {
    visibility: "hidden",
  },
});
