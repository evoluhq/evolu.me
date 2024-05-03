import { ParseResult } from "@effect/schema";
import * as S from "@effect/schema/Schema";
import { Temporal } from "temporal-polyfill";
import { NoteId } from "./Db";

// urls
// evolu.me/day/2024-06-01
// evolu.me/month/2024-06
// evolu.me/year/2024
// evolu.me/note/3452

const isPlainDate = (date: unknown): date is Temporal.PlainDate =>
  date instanceof Temporal.PlainDate;

const PlainDateFromSelf = S.declare(isPlainDate).pipe(
  S.identifier("PlainDateFromSelf"),
);

/** Date in this format: 2024-06-01 */
export const PlainDateFromUrlString = S.transformOrFail(
  S.String,
  PlainDateFromSelf,
  {
    decode: (string, _, ast) =>
      /^\d{4}-\d{2}-\d{2}$/.test(string)
        ? ParseResult.succeed(Temporal.PlainDate.from(string))
        : ParseResult.fail(new ParseResult.Type(ast, string)),
    encode: (date) => ParseResult.succeed(date.toString()),
  },
);

export const getDayUrl = (
  date: Temporal.PlainDate,
  today: Temporal.PlainDate,
) =>
  date.equals(today)
    ? "/"
    : `/day/${S.encodeSync(PlainDateFromUrlString)(date)}`;

export const getNoteUrl = (id: NoteId) => `/note/${id}`;
