import { IO } from "fp-ts/IO";
import { useSyncExternalStore } from "react";

const subscribe = (onChange: IO<void>) => {
  window.visualViewport?.addEventListener("scroll", onChange);
  window.visualViewport?.addEventListener("resize", onChange);
  return () => {
    window.visualViewport?.removeEventListener("scroll", onChange);
    window.visualViewport?.removeEventListener("resize", onChange);
  };
};

const getSnapshot = () => window.visualViewport;

export const useVisualViewport = () => {
  return useSyncExternalStore(subscribe, getSnapshot);
};
