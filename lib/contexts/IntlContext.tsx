import { FC, ReactNode, createContext, useRef } from "react";
import { Temporal, Intl } from "temporal-polyfill";

interface IntlContextValue {
  weekInfo: WeekInfo;

  toLocaleString: (
    value: Temporal.PlainDate | Temporal.PlainYearMonth,
    options?: Intl.DateTimeFormatOptions,
  ) => string;

  startOfWeek: (date: Temporal.PlainDate) => Temporal.PlainDate;
}

/**
 * Type polyfill.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo
 */
export interface WeekInfo {
  readonly firstDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  readonly weekend: number[];
  readonly minimalDays: number;
}

// /** Type polyfill. */
// interface Locale extends Intl.Locale {
//   getWeekInfo?: () => WeekInfo;
//   weekInfo?: WeekInfo;
// }

const defaultWeekInfo: WeekInfo = {
  /* Firefox */
  firstDay: 1,
  weekend: [6, 7],
  minimalDays: 4,
};

export const IntlContext = createContext<IntlContextValue>({
  weekInfo: defaultWeekInfo,
  toLocaleString: () => {
    throw new Error("missing IntlProvider");
  },
  startOfWeek: () => {
    throw new Error("missing IntlProvider");
  },
});

export const IntlProvider: FC<{
  children: ReactNode;
  localeString?: string;
}> = ({
  children,
  localeString = new Intl.DateTimeFormat().resolvedOptions().locale,
}) => {
  // const locale = new Intl.Locale(localeString) as Locale;
  // const weekInfo: WeekInfo =
  //   locale.getWeekInfo?.() || locale.weekInfo || defaultWeekInfo;

  /**
   * Force defaultWeekInfo because it returns the wrong value to me (Sunday
   * instead of Monday). I think this must be configurable or detected in
   * another way.
   */
  const weekInfo = defaultWeekInfo;

  const valueRef = useRef<IntlContextValue>({
    weekInfo,

    toLocaleString: (value, options) => {
      return value.toLocaleString(localeString, {
        ...options,
        calendar: "iso8601",
      });
    },

    startOfWeek: (date) => getStartOfWeek(weekInfo, date),
  });

  return (
    <IntlContext.Provider value={valueRef.current}>
      {children}
    </IntlContext.Provider>
  );
};

/**
 * "It's the region, not the calendar, that defines the first day of the week"
 * https://github.com/js-temporal/temporal-polyfill/issues/220#issuecomment-1421353489
 *
 * TODO: It doesn't always return what the user expects, so it should be
 * configurable.
 */
const getStartOfWeek = (
  weekInfo: WeekInfo,
  date: Temporal.PlainDate,
): Temporal.PlainDate => {
  const { firstDay } = weekInfo;
  return date.subtract({
    // https://github.com/date-fns/date-fns/blob/main/src/startOfWeek/index.ts
    days: (date.dayOfWeek < firstDay ? 7 : 0) + date.dayOfWeek - firstDay,
  });
};
