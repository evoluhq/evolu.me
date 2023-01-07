import { option } from "fp-ts";
import { pipe } from "fp-ts/function";
import { NodeMarkdown } from "./db";

export const getFirstLineAlwaysVisible = (md: NodeMarkdown) =>
  pipe(
    md.split("\n")[0],
    option.fromPredicate((a) => a.trim().length > 0),
    option.getOrElse(() => "…")
  );
