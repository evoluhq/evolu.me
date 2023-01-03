import { IO } from "fp-ts/IO";
import { useSyncExternalStore } from "react";
import { BRAND } from "zod";

const subscribe = (onChange: IO<void>) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

export type LocationHash = string & BRAND<"LocationHash">;

const getSnapshot = (): LocationHash =>
  window.location.hash.replace(/^#/, "") as LocationHash;

const getServerSnapshot = (): LocationHash => "" as LocationHash;

export const useLocationHash = (): LocationHash => {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
