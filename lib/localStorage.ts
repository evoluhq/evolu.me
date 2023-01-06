import { array, option, string } from "fp-ts";
import { flow, identity, pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";

const localStorageKeyPrefix = "evolume:";

export const createLocalStorageKey = (s: string) =>
  `${localStorageKeyPrefix}${s}`;

// Must be called before Evolu restoreOwner and resetOwner.
export const clearAllLocalStorageEvoluMeKeys: IO<void> = () => {
  pipe(
    array.makeBy(localStorage.length, identity),
    array.filterMap(
      flow(
        (i) => localStorage.key(i),
        option.fromNullable,
        option.chain(
          option.fromPredicate(string.startsWith(localStorageKeyPrefix))
        )
      )
    )
  ).forEach((key) => {
    localStorage.removeItem(key);
  });
};
