import { IO } from "fp-ts/IO";
import { useSyncExternalStore } from "react";
import { BRAND } from "zod";

export type LocationHash = string & BRAND<"LocationHash">;

const currentLocationHash = (): LocationHash =>
  window.location.hash.replace(/^#/, "") as LocationHash;

const subscribe = (onChange: IO<void>) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

export const useLocationHash = (): LocationHash => {
  return useSyncExternalStore(subscribe, currentLocationHash);
};
