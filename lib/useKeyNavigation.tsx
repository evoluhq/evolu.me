import { bounded, number, option, record } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
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
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { BRAND } from "zod";

const isWindowDefined = typeof window != "undefined";
const IS_SERVER = !isWindowDefined || "Deno" in window;
// React throws a warning when using useLayoutEffect on the server.
// useEffect on the server is no-op.
const useIsomorphicLayoutEffect = IS_SERVER ? useEffect : useLayoutEffect;

// React Hook for keyboard navigation via Roving tabindex
//  - fast, flexible, minimal
//  - for lists and grids
//  - and without unnecessary re-renders
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
// TODO: Add an option for rotation, aka jump from start to end.
// TODO: useEvent
// https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md
// TODO: Release as use-key-navigation

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
  children:
    | ReactNode
    | ((position: KeyboardNavigationSafePosition) => ReactNode);
}

export type KeyboardNavigationFocusCallback = IO<void>;

export type KeyboardNavigationRegister = (
  position: KeyboardNavigationPosition,
  focusCallback: KeyboardNavigationFocusCallback
) => IO<void>;

export type KeyboardNavigationOnFocus = (
  position: KeyboardNavigationPosition | number
) => void;

export type KeyboardNavigationMoveDirection =
  | "nextX"
  | "previousX"
  | "nextY"
  | "previousY"
  | "current";

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

  useIsomorphicLayoutEffect(() => {
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
  useIsomorphicLayoutEffect(() => {
    positionAndBoundsRef.current = getPositionAndBounds();
  }, [getPositionAndBounds]);

  // Must be stable.
  const move = useCallback<KeyboardNavigationMove>((direction) => {
    const { position, maxX, maxY } = positionAndBoundsRef.current;
    if (direction === "current") {
      const focusCallback = focusCallbacksRef.current[position.x]?.[position.y];
      if (focusCallback) {
        focusCallback();
        return;
      }
    }

    const isX = direction === "nextX" || direction === "previousX";
    const isNext = direction === "nextX" || direction === "nextY";
    const increment = isNext ? 1 : -1;

    for (
      let i = (isX ? position.x : position.y) + increment;
      isNext ? i <= (isX ? maxX : maxY) : i >= 0;
      i += increment
    ) {
      const focusCallback =
        focusCallbacksRef.current[isX ? i : position.x]?.[isX ? position.y : i];
      if (focusCallback) {
        focusCallback();
        break;
      }
    }
  }, []);

  const contextValueRef = useRef({ register, onFocus, move });

  return useMemo(
    () => (
      <KeyboardNavigationContext.Provider value={contextValueRef.current}>
        {typeof children === "function" ? children(position) : children}
      </KeyboardNavigationContext.Provider>
    ),
    [children, position]
  );
};

export interface KeyboardNavigationFocusable {
  focus: IO<void>;
}

export type KeyboardNavigationKey =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowRight"
  | "ArrowLeft"
  | "Escape"
  | "Backspace"
  | "Enter";

export type KeyboardNavigationKeyAction<E extends HTMLElement> =
  | KeyboardNavigationMoveDirection
  | { id: string }
  | ((e: KeyboardEvent<E>) => void);

export type KeyboardNavigationKeys<E extends HTMLElement> = Partial<
  Record<
    KeyboardNavigationKey,
    | KeyboardNavigationKeyAction<E>
    | [KeyboardNavigationKeyAction<E>, Predicate<KeyboardEvent<E>>]
  >
>;

export type KeyboardNavigationKeyDownHandler<E extends HTMLElement> = (
  e: KeyboardEvent<E>
) => void;

export const focusElementWithId = (id: string) => {
  document.getElementById(id)?.focus();
};

export const useKeyNavigation = <
  R extends KeyboardNavigationFocusable,
  E extends HTMLElement = HTMLInputElement
>({
  x = 0,
  y = 0,
  keys,
}: {
  x?: number;
  y?: number;
  keys: KeyboardNavigationKeys<E>;
}): {
  ref: RefObject<R>;
  onFocus: IO<void>;
  onKeyDown: KeyboardNavigationKeyDownHandler<E>;
} => {
  const { register, onFocus, move } = useContext(KeyboardNavigationContext);
  const ref = useRef<R>(null);

  useIsomorphicLayoutEffect(() => {
    const { current: handler } = ref;
    if (!handler) return;
    return register({ x, y }, handler.focus.bind(handler));
  }, [register, x, y]);

  const handleOnFocus = useCallback(() => onFocus({ x, y }), [onFocus, x, y]);

  const handleKeyDown = useCallback<KeyboardNavigationKeyDownHandler<E>>(
    (e) => {
      pipe(
        keys,
        record.lookup(e.key),
        option.map((arg) =>
          Array.isArray(arg) ? arg : ([arg, null] as const)
        ),
        option.match(constVoid, ([action, predicate]) => {
          if (predicate && !predicate(e)) return;
          e.preventDefault();
          switch (typeof action) {
            case "string":
              move(action);
              break;
            case "function":
              action(e);
              break;
            default: {
              focusElementWithId(action.id);
            }
          }
        })
      );
    },
    [keys, move]
  );

  return useMemo(
    () => ({ ref, onFocus: handleOnFocus, onKeyDown: handleKeyDown }),
    [handleKeyDown, handleOnFocus]
  );
};
