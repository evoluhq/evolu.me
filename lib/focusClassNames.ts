import { IO } from "fp-ts/IO";
import { pipe } from "fp-ts/function";
import { array } from "fp-ts";

const createFocusClassNames = <T extends string>(
  names: T[]
): { [K in T]: string } => {
  let counter = 0;
  const createId = () => `focus-${(counter++).toString(36)}`;
  const id: Record<string, string> = {};
  names.forEach((name) => {
    id[name] = createId();
  });
  return id as never;
};

export const focusClassNames = createFocusClassNames([
  // TODO: Review and delete unused.
  "createNodeInput",
  "firstNodeItemLink",
  "lastNodeItemLink",
  "firstNodeFilterLink",
  "allLink",
  "saveNodeButton",
]);

export type FocusClassName = keyof typeof focusClassNames;

//
export const focusClassName =
  (...className: FocusClassName[]): IO<void> =>
  () =>
    pipe(
      className,
      array.map((c) => `.${focusClassNames[c]}`),
      (a) => a.join(", "),
      (s) => document.querySelector(s),
      (el) => {
        if (el && "focus" in el && typeof el.focus === "function") el.focus();
      }
    );
