import { bounded, number, option, record } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { Predicate } from "fp-ts/Predicate";
import {
  createContext,
  FC,
  KeyboardEvent,
  ReactNode,
  Reducer,
  RefObject,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { BRAND } from "zod";

// React Hook for keyboard navigation via Roving tabindex
//  - fast, flexible, minimal
//  - for lists and grids
//  - and without unnecessary re-renders
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
// TODO: Release as react-keyboard-navigation

export interface KeyboardNavigationPosition {
  x: number;
  y: number;
}

type KeyboardNavigationSafePosition = KeyboardNavigationPosition &
  BRAND<"safe">;

export interface KeyboardNavigationProviderProps {
  maxX: number;
  maxY?: number;
  initialX?: number;
  initialY?: number;
  children: (position: KeyboardNavigationSafePosition) => ReactNode;
}

export type KeyboardNavigationFocusCallback = () => void;

export type KeyboardNavigationRegister = (
  position: KeyboardNavigationPosition,
  focusCallback: KeyboardNavigationFocusCallback
) => () => void;

export type KeyboardNavigationOnFocus = (
  position: KeyboardNavigationPosition | number
) => void;

export type KeyboardNavigationMoveDirection =
  | "nextX"
  | "previousX"
  | "nextY"
  | "previousY";

export type KeyboardNavigationMove = (
  direction: KeyboardNavigationMoveDirection
) => void;

/** Limit `x` and `y` to ensure focus is not lost. */
interface KeyboardNavigationPositionBounds {
  maxX: number;
  maxY: number;
}

export const KeyboardNavigationContext = createContext<{
  register: KeyboardNavigationRegister;
  onFocus: KeyboardNavigationOnFocus;
  move: KeyboardNavigationMove;
}>({
  register: () => constVoid,
  onFocus: () => constVoid,
  move: constVoid,
});

// https://dev.to/gcanti/functional-design-smart-constructors-14nb
const createSafePosition = ({
  x,
  y,
  maxX,
  maxY,
}: KeyboardNavigationPosition &
  KeyboardNavigationPositionBounds): KeyboardNavigationSafePosition =>
  ({
    x: bounded.clamp({ ...number.Ord, bottom: 0, top: maxX })(x),
    y: bounded.clamp({ ...number.Ord, bottom: 0, top: maxY })(y),
  } as KeyboardNavigationSafePosition);

export const KeyboardNavigationProvider: FC<
  KeyboardNavigationProviderProps
> = ({ maxX, maxY = 0, initialX = 0, initialY = 0, children }) => {
  // The `move` function must be stable and have access to props,
  // which is possible only with the inline reducer.
  // https://twitter.com/dan_abramov/status/1102010979611746304
  const reducer: Reducer<
    KeyboardNavigationSafePosition,
    | { type: "setPosition"; position: KeyboardNavigationPosition }
    | { type: "updateBounds"; bounds: KeyboardNavigationPositionBounds }
  > = (state, action) => {
    let nextState;
    switch (action.type) {
      case "setPosition":
        nextState = createSafePosition({ ...action.position, maxX, maxY });
        break;
      case "updateBounds":
        nextState = createSafePosition({ ...state, ...action.bounds });
        break;
    }
    return nextState.x === state.x && nextState.y === state.y
      ? state
      : nextState;
  };

  const [position, dispatch] = useReducer(reducer, null, () =>
    createSafePosition({ x: initialX, y: initialY, maxX, maxY })
  );

  useLayoutEffect(() => {
    dispatch({ type: "updateBounds", bounds: { maxX, maxY } });
  }, [maxX, maxY]);

  type SparseArray<T> = (T | undefined)[];
  const focusCallbacksRef = useRef<
    SparseArray<SparseArray<KeyboardNavigationFocusCallback>>
  >([]);

  // Must be stable.
  const register = useCallback<KeyboardNavigationRegister>(
    ({ x, y }, focusCallback) => {
      const { current: callbacks } = focusCallbacksRef;
      const yCallbacks = callbacks[x] || (callbacks[x] = []);
      yCallbacks[y] = focusCallback;
      return () => {
        delete yCallbacks[y];
      };
    },
    []
  );

  // Must be stable.
  const onFocus = useCallback<KeyboardNavigationOnFocus>((position) => {
    dispatch({
      type: "setPosition",
      position: typeof position === "number" ? { x: position, y: 0 } : position,
    });
  }, []);

  const getPositionAndBounds = useCallback(
    () => ({ position, maxX, maxY }),
    [maxX, maxY, position]
  );
  const positionAndBoundsRef = useRef(getPositionAndBounds());
  useLayoutEffect(() => {
    positionAndBoundsRef.current = getPositionAndBounds();
  }, [getPositionAndBounds]);

  // Must be stable.
  const move = useCallback<KeyboardNavigationMove>((direction) => {
    const isX = direction === "nextX" || direction === "previousX";
    const { position, maxX, maxY } = positionAndBoundsRef.current;
    const isNext = direction === "nextX" || direction === "nextY";
    const increment = isNext ? 1 : -1;

    for (
      let i = (isX ? position.x : position.y) + increment;
      isNext ? i <= (isX ? maxX : maxY) : i >= 0;
      i += increment
    ) {
      const callback =
        focusCallbacksRef.current[isX ? i : position.x]?.[isX ? position.y : i];
      if (callback) {
        callback();
        break;
      }
    }
  }, []);

  const contextValueRef = useRef({ register, onFocus, move });

  return useMemo(
    () => (
      <KeyboardNavigationContext.Provider value={contextValueRef.current}>
        {children(position)}
      </KeyboardNavigationContext.Provider>
    ),
    [children, position]
  );
};

export interface KeyboardNavigationFocusHandler {
  focus: KeyboardNavigationFocusCallback;
}

export const useKeyboardNavigationRef = <
  T extends KeyboardNavigationFocusHandler
>(
  x: number,
  y = 0
): RefObject<T> => {
  const ref = useRef<T>(null);
  const { register } = useContext(KeyboardNavigationContext);

  useLayoutEffect(() => {
    const { current: handler } = ref;
    if (!handler) return;
    return register({ x, y }, handler.focus.bind(handler));
  }, [register, x, y]);

  return ref;
};

export const useKeyboardNavigationOnInputKeyDown = (
  config: Record<
    string,
    | KeyboardNavigationMoveDirection
    | [
        KeyboardNavigationMoveDirection,
        Predicate<KeyboardEvent<HTMLInputElement>>
      ]
  >
) => {
  const { move } = useContext(KeyboardNavigationContext);
  // TODO: useEvent probably.
  // https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
  return (e: KeyboardEvent<HTMLInputElement>) =>
    pipe(
      config,
      record.lookup(e.key),
      option.map((arg) =>
        typeof arg === "string"
          ? { direction: arg }
          : { direction: arg[0], predicate: arg[1] }
      ),
      option.match(constVoid, ({ direction, predicate }) => {
        if (predicate && !predicate(e)) return;
        e.preventDefault();
        move(direction);
      })
    );
};

export const useKeyboardNavigationOnFocus = () =>
  useContext(KeyboardNavigationContext).onFocus;
