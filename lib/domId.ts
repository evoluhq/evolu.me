import { IO } from "fp-ts/IO";

export const domId = {
  createEvoluInput: "createEvoluInput",
  lastEvoluInput: "lastEvoluInput",
  firstFilterButton: "firstFilterButton",
} as const;

export const domFocus =
  (id: keyof typeof domId) =>
  (e: { preventDefault: IO<void> }): false => {
    e.preventDefault();
    document.getElementById(id)?.focus();
    return false;
  };
