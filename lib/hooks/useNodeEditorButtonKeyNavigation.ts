import { focusClassName } from "../focusClassNames";
import { useKeyNavigation } from "./useKeyNavigation";

export const useNodeEditorButtonKeyNavigation = (x: number) =>
  useKeyNavigation({
    x,
    keys: {
      ArrowLeft: "previousX",
      ArrowRight: "nextX",
      ArrowUp: focusClassName("createNodeInput"),
    },
  });
