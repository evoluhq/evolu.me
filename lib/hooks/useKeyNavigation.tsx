import { bounded, number, option, record } from "fp-ts";
import { absurd, constVoid, pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { Predicate } from "fp-ts/Predicate";
import {
  createContext,
  forwardRef,
  KeyboardEvent,
  ReactNode,
  Reducer,
  RefCallback,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import useEvent from "react-use-event-hook";

// React Hook for keyboard navigation via Roving tabindex
//  - fast, flexible, minimal, and universal
//  - for lists and grids
//  - without unnecessary re-renders
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
// TODO: Add an option for rotation, aka jump from start to end.
// TODO: Release as use-key-navigation in Evolu org.

const IS_SERVER = typeof window === "undefined" || "Deno" in window;
// https://github.com/facebook/react/issues/14927#issuecomment-572720368
const useLayoutEffect_SAFE_FOR_SSR = IS_SERVER ? useEffect : useLayoutEffect;

export interface FocusPosition {
  x: number;
  y: number;
}

interface Focusable {
  focus: IO<void>;
}

type Register = (position: FocusPosition, focusable: Focusable) => IO<void>;

type OnFocus = (position: FocusPosition) => void;

type OnBlur = () => void;

type OnKey = (key: string) => void;

export type Direction =
  | "nextX"
  | "previousX"
  | "nextY"
  | "previousY"
  | "current";

type MoveOptions = {
  smoothScroll?: boolean;
};

type Move = (
  directionOrPosition: Direction | FocusPosition,
  options?: MoveOptions
) => void;

interface ContextType {
  register: Register;
  onFocus: OnFocus;
  onBlur: OnBlur;
  onKey: OnKey;
  move: Move;
}

export const KeyboardNavigationContext = createContext<ContextType>({
  register: () => constVoid,
  onFocus: constVoid,
  onBlur: constVoid,
  onKey: constVoid,
  move: constVoid,
});

/** Limit `x` and `y` to ensure focus is not lost. */
interface Bounds {
  maxX: number;
  maxY: number;
}

const createBoundedPosition = (
  { x, y }: FocusPosition,
  { maxX, maxY }: Bounds
): FocusPosition => ({
  x: bounded.clamp({ ...number.Ord, bottom: 0, top: maxX })(x),
  y: bounded.clamp({ ...number.Ord, bottom: 0, top: maxY })(y),
});

interface KeyboardNavigationProviderProps {
  maxX: number;
  maxY?: number;
  initialX?: number;
  initialY?: number;
  children:
    | ReactNode
    | ((state: { x: number; y: number; hasFocus: boolean }) => ReactNode);
  onFocus?: (position: FocusPosition) => void;
  onKey?: OnKey;
  smoothScrollDomId?: string;
}

interface State {
  position: FocusPosition;
  hasFocus: boolean;
}

type Action = { type: "onFocus"; position: FocusPosition } | { type: "onBlur" };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "onFocus":
      return { ...state, position: action.position, hasFocus: true };
    case "onBlur":
      return { ...state, hasFocus: false };
  }
};

type SparseArray<T> = (T | undefined)[];

export interface KeyboardNavigationProviderRef {
  move: Move;
}

export const KeyboardNavigationProvider = forwardRef<
  KeyboardNavigationProviderRef,
  KeyboardNavigationProviderProps
>(function KeyboardNavigationProvider(
  {
    maxX,
    maxY = 0,
    initialX = 0,
    initialY = 0,
    children,
    onFocus,
    onKey,
    smoothScrollDomId,
  },
  ref
) {
  useImperativeHandle(ref, () => ({ move }));

  const [state, dispatch] = useReducer(reducer, null, () => ({
    position: { x: initialX, y: initialY },
    hasFocus: false,
  }));

  const position = useMemo(
    () => createBoundedPosition(state.position, { maxX, maxY }),
    [maxX, maxY, state.position]
  );

  const focusablesRef = useRef<SparseArray<SparseArray<Focusable>>>();
  const getFocusables = () => {
    if (!focusablesRef.current) focusablesRef.current = [];
    return focusablesRef.current;
  };

  const register = useCallback<Register>(({ x, y }, focusable) => {
    const focusables = getFocusables();
    const yFocusables = focusables[x] || (focusables[x] = []);
    yFocusables[y] = focusable;
    return () => {
      delete yFocusables[y];
    };
  }, []);

  const handleFocus = useEvent<OnFocus>((position) => {
    dispatch({ type: "onFocus", position });
    if (onFocus) onFocus(position);
  });

  const handleBlur = useEvent<OnBlur>(() => {
    dispatch({ type: "onBlur" });
  });

  const removeScrollSmoothClassTimerRef = useRef<number>();

  // Element focus doesn't have smooth scroll option.
  // https://github.com/WICG/proposals/issues/41
  const workaroundMissingFocusWithSmoothScroll = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prevScrollBehavior = el.style.scrollBehavior;
    el.style.scrollBehavior = "smooth";
    clearTimeout(removeScrollSmoothClassTimerRef.current);
    removeScrollSmoothClassTimerRef.current = window.setTimeout(() => {
      el.style.scrollBehavior = prevScrollBehavior;
    });
  }, []);

  const callFocus = (
    focusable: Focusable | undefined,
    smoothScroll: boolean
  ) => {
    if (focusable == null) return;
    if (smoothScrollDomId && smoothScroll)
      workaroundMissingFocusWithSmoothScroll(smoothScrollDomId);
    focusable.focus();
  };

  const move = useEvent<Move>(
    (directionOrPosition, { smoothScroll = true } = {}) => {
      const focusables = getFocusables();

      if (typeof directionOrPosition === "object") {
        callFocus(
          focusables[directionOrPosition.x]?.[directionOrPosition.y],
          smoothScroll
        );
        return;
      }

      const direction = directionOrPosition;

      if (direction === "current") {
        callFocus(focusables[position.x]?.[position.y], smoothScroll);
        return;
      }

      const isX = direction === "nextX" || direction === "previousX";
      const isNext = direction === "nextX" || direction === "nextY";
      const increment = isNext ? 1 : -1;

      for (
        let i = (isX ? position.x : position.y) + increment;
        isNext ? i <= (isX ? maxX : maxY) : i >= 0;
        i += increment
      ) {
        const focusable =
          focusables[isX ? i : position.x]?.[isX ? position.y : i];
        if (focusable) {
          callFocus(focusable, smoothScroll);
          break;
        }
      }
    }
  );

  const contextValueRef = useRef<ContextType>();
  const getContextValue = () => {
    if (!contextValueRef.current)
      contextValueRef.current = {
        register,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKey: onKey || constVoid,
        move,
      };
    return contextValueRef.current;
  };

  return (
    <KeyboardNavigationContext.Provider value={getContextValue()}>
      {typeof children === "function"
        ? children({ ...position, hasFocus: state.hasFocus })
        : children}
    </KeyboardNavigationContext.Provider>
  );
});

type Key =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowRight"
  | "ArrowLeft"
  | "Escape"
  | "Backspace"
  | "Enter";

type KeyAction<E extends HTMLElement> =
  | Direction
  | ((e: KeyboardEvent<E>) => void);

type Keys<E extends HTMLElement> = Partial<
  Record<Key, KeyAction<E> | [KeyAction<E>, Predicate<KeyboardEvent<E>>]>
>;

type KeyDownHandler<E extends HTMLElement> = (e: KeyboardEvent<E>) => void;

interface KeyNavigation<E extends HTMLElement> {
  ref: RefCallback<Focusable>;
  onFocus: IO<void>;
  onBlur: IO<void>;
  onKeyDown: KeyDownHandler<E>;
}

export const useKeyNavigation = <E extends HTMLElement>({
  x = 0,
  y = 0,
  keys,
}: {
  x?: number;
  y?: number;
  keys: Keys<E>;
}): KeyNavigation<E> => {
  const { register, onFocus, onBlur, onKey, move } = useContext(
    KeyboardNavigationContext
  );

  const focusableRef = useRef<Focusable | null>(null);

  // We need RefCallback because MutableRefObject don't work with Focusable type.
  // The ref is stable for better performance and more straightforward reasoning.
  const ref = useCallback<RefCallback<Focusable>>((focusable) => {
    focusableRef.current = focusable;
  }, []);

  // Must register ASAP.
  useLayoutEffect_SAFE_FOR_SSR(() => {
    if (!focusableRef.current) return;
    return register({ x, y }, focusableRef.current);
  }, [register, x, y]);

  const handleOnFocus = useEvent(() => onFocus({ x, y }));

  const handleOnBlur = useEvent(onBlur);

  const handleKeyDown = useEvent<KeyDownHandler<E>>((e) => {
    if (onKey) onKey(e.key);

    pipe(
      keys,
      record.lookup(e.key),
      option.map((arg) => (Array.isArray(arg) ? arg : ([arg, null] as const))),
      option.match(constVoid, ([action, predicate]) => {
        if (predicate && !predicate(e)) return;
        switch (typeof action) {
          case "string":
          case "object":
            e.preventDefault();
            move(action);
            break;
          case "function":
            action(e);
            break;
          default: {
            absurd(action);
          }
        }
      })
    );
  });

  return {
    ref,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    onKeyDown: handleKeyDown,
  };
};
