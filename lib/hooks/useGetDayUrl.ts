import { useCallback, useContext } from "react";
import { Temporal } from "temporal-polyfill";
import { getDayUrl } from "../Routing";
import { NowContext } from "../contexts/NowContext";

export const useGetDayUrl = () => {
  const now = useContext(NowContext);
  return useCallback(
    (date: Temporal.PlainDate) => getDayUrl(date, now.plainDateISO()),
    [now],
  );
};
