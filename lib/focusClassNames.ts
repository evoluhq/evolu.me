import { IO } from "fp-ts/IO";

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
  "createNodeInput",
  "firstNodeItemLink",
  "lastNodeItemLink",
  "firstNodeFilterLink",
]);

export const focusClassName =
  (className: keyof typeof focusClassNames): IO<void> =>
  () => {
    const el = document.querySelector(`.${focusClassNames[className]}`);
    if (el && "focus" in el && typeof el.focus === "function") el.focus();
  };
