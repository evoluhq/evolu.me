import { useCallback, useContext } from "react";
import { Temporal } from "temporal-polyfill";
import {
  SqliteDate,
  SqliteDateTime,
  SqliteTime,
  castTemporal,
} from "../temporal/castTemporal";
import { NowContext } from "../contexts/NowContext";

export const useCastTemporal = () => {
  const now = useContext(NowContext);

  function castTemporalWithoutFirstArg(
    value: SqliteDateTime,
  ): Temporal.PlainDateTime;
  function castTemporalWithoutFirstArg(value: SqliteDate): Temporal.PlainDate;
  function castTemporalWithoutFirstArg(value: SqliteTime): Temporal.PlainTime;
  function castTemporalWithoutFirstArg(
    value: Temporal.PlainDateTime,
  ): SqliteDateTime;
  function castTemporalWithoutFirstArg(value: Temporal.PlainDate): SqliteDate;
  function castTemporalWithoutFirstArg(value: Temporal.PlainTime): SqliteTime;
  function castTemporalWithoutFirstArg(
    value:
      | SqliteDateTime
      | SqliteDate
      | SqliteTime
      | Temporal.PlainDateTime
      | Temporal.PlainDate
      | Temporal.PlainTime,
  ):
    | SqliteDateTime
    | SqliteDate
    | SqliteTime
    | Temporal.PlainDateTime
    | Temporal.PlainDate
    | Temporal.PlainTime {
    return castTemporal(now.timeZoneId(), value as never);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(castTemporalWithoutFirstArg, [now]);
};
