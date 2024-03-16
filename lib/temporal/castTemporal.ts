import * as S from "@effect/schema/Schema";
import { Temporal } from "temporal-polyfill";

// https://www.sqlite.org/lang_datefunc.html

/** To avoid a clash with the JavaScript Date SqliteDate type. */
const TemporalString = S.string.pipe(S.brand("TemporalString"));

/**
 * UTC DateTime is stored in ISO 8601 format to ensure datetimes can be sorted
 * and compared lexicographically.
 */
export const SqliteDateTime = TemporalString.pipe(S.brand("SqliteDateTime"));
export type SqliteDateTime = S.Schema.Type<typeof SqliteDateTime>;

/** YYYY-MM-DD. There is no UTC. We can't say without a time. */
export const SqliteDate = TemporalString.pipe(S.brand("SqliteDate"));
export type SqliteDate = S.Schema.Type<typeof SqliteDate>;

/** HH:MM. There is no UTC. We can't say without a date. */
export const SqliteTime = TemporalString.pipe(S.brand("SqliteTime"));
export type SqliteTime = S.Schema.Type<typeof SqliteTime>;

/** Cast plain Temporal values to UTC strings and vice-versa. */
export function castTemporal(
  timeZoneId: string,
  value: SqliteDateTime,
): Temporal.PlainDateTime;
export function castTemporal(
  timeZoneId: string,
  value: SqliteDate,
): Temporal.PlainDate;
export function castTemporal(
  timeZoneId: string,
  value: SqliteTime,
): Temporal.PlainTime;
export function castTemporal(
  timeZoneId: string,
  value: Temporal.PlainDateTime,
): SqliteDateTime;
export function castTemporal(
  timeZoneId: string,
  value: Temporal.PlainDate,
): SqliteDate;
export function castTemporal(
  timeZoneId: string,
  value: Temporal.PlainTime,
): SqliteTime;
export function castTemporal(
  timeZoneId: string,
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
  if (typeof value === "string") {
    switch (value.length) {
      case 10:
        return Temporal.PlainDate.from(value);
      case 5:
        return Temporal.PlainTime.from(value);
      default:
        return Temporal.Instant.from(value)
          .toZonedDateTimeISO(timeZoneId)
          .toPlainDateTime();
    }
  }
  if (value instanceof Temporal.PlainDateTime)
    return value
      .toZonedDateTime(timeZoneId)
      .toInstant()
      .toString() as SqliteDateTime;
  if (value instanceof Temporal.PlainDate)
    return value.toString() as SqliteDate;
  return value.toString().slice(0, 5) as SqliteTime;
}
