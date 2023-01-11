import { IO } from "fp-ts/IO";
import { pipe } from "fp-ts/function";
import { array } from "fp-ts";

// Why not useId? Because it would require context provider.
// Module constants are better.
const createFocusIds = <T extends string>(names: T[]): { [K in T]: string } => {
  let counter = 0;
  const createId = () => `focus-${(counter++).toString(36)}`;
  const id: Record<string, string> = {};
  names.forEach((name) => {
    id[name] = createId();
  });
  return id as never;
};

export const focusIds = createFocusIds(["editorContentEditable", "allLink"]);

type FocusId = keyof typeof focusIds;

export const focusId =
  (...id: FocusId[]): IO<void> =>
  () =>
    pipe(
      id,
      array.map((c) => `#${focusIds[c]}`),
      (a) => a.join(", "),
      (s) => document.querySelector(s),
      (el) => {
        if (el && "focus" in el && typeof el.focus === "function") el.focus();
      }
    );
