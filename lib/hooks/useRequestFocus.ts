import { IO } from "fp-ts/IO";

let focusRequested = false;

const requestFocus = (calllback?: IO<void>) => {
  if (!calllback) {
    focusRequested = true;
    return;
  }
  if (!focusRequested) return;
  calllback();
  focusRequested = false;
};

export const useRequestFocus = () => requestFocus;
