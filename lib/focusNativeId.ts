import { IO } from "fp-ts/IO";

export const nativeId = {
  createEvoluInput: "createEvoluInput",
  lastEvoluInput: "lastEvoluInput",
  firstFilterButton: "firstFilterButton",
} as const;

export const focusNativeId =
  (id: keyof typeof nativeId) =>
  (e: { preventDefault: IO<void> }): false => {
    e.preventDefault();
    try {
      document.getElementById(id)?.focus();
    } catch (e) {
      //
    }
    return false;
  };
