import { useContext, useEffect } from "react";
import {
  Direction,
  KeyboardNavigationContext,
} from "../lib/hooks/useKeyNavigation";

let _requestNodeListFocus: Direction | null = null;

export const requestNodeListFocus = (direction: Direction) => {
  _requestNodeListFocus = direction;
};

export const NodeListFocus = () => {
  const { move } = useContext(KeyboardNavigationContext);

  useEffect(() => {
    if (_requestNodeListFocus != null) {
      move(_requestNodeListFocus);
      _requestNodeListFocus = null;
    }
  });

  return null;
};
