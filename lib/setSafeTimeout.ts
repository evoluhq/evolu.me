import { IO } from "fp-ts/IO";

// This is a workaround, and it should not exists.
// The problem is Evolu mutate callback is called after
// setting the state when DOM still needs to be updated,
// but we need to call focus already.
// Another workaround is ReactDOM flushSync.
// The better solution is using useEffect with some flags.
// The ideal solution would be React idiomatic focus support.
export const setSafeTimeout = (callback: IO<void>) => {
  setTimeout(callback, 10);
};
