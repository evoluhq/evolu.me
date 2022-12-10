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
  RefCallback,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import useEvent from "react-use-event-hook";
import { BRAND } from "zod";

export const IS_SERVER = typeof window === "undefined" || "Deno" in window;
export const useIsomorphicLayoutEffect = IS_SERVER
  ? useEffect
  : useLayoutEffect;

// React Hook for keyboard navigation via Roving tabindex
//  - fast, flexible, minimal
//  - for lists and grids
//  - and without unnecessary re-renders
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets
// TODO: Add an option for rotation, aka jump from start to end.
// TODO: Release as use-key-navigation

interface Position {
  x: number;
  y: number;
}

type BoundedPosition = Position & BRAND<"bounded">;

interface Focusable {
  focus: IO<void>;
}

type Register = (position: Position, focusable: Focusable) => IO<void>;

type OnFocus = (position: Position) => void;

type OnBlur = () => void;

// TODO: Add Position.
export type Direction =
  | "nextX"
  | "previousX"
  | "nextY"
  | "previousY"
  | "current";

type Move = (direction: Direction) => void;

interface ContextType {
  register: Register;
  onFocus: OnFocus;
  onBlur: OnBlur;
  move: Move;
}

export const KeyboardNavigationContext = createContext<ContextType>({
  register: () => constVoid,
  onFocus: constVoid,
  onBlur: constVoid,
  move: constVoid,
});

/** Limit `x` and `y` to ensure focus is not lost. */
interface Bounds {
  maxX: number;
  maxY: number;
}

// // https://dev.to/gcanti/functional-design-smart-constructors-14nb
const createBoundedPosition = (
  { x, y }: Position,
  { maxX, maxY }: Bounds
): BoundedPosition =>
  ({
    x: bounded.clamp({ ...number.Ord, bottom: 0, top: maxX })(x),
    y: bounded.clamp({ ...number.Ord, bottom: 0, top: maxY })(y),
  } as BoundedPosition);

export interface KeyboardNavigationProviderProps {
  maxX: number;
  maxY?: number;
  initialX?: number;
  initialY?: number;
  children:
    | ReactNode
    | ((state: { x: number; y: number; hasFocus: boolean }) => ReactNode);
}

interface State {
  position: Position;
  hasFocus: boolean;
}

type Action = { type: "onFocus"; position: Position } | { type: "onBlur" };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "onFocus":
      return { ...state, position: action.position, hasFocus: true };
    case "onBlur":
      return { ...state, hasFocus: false };
  }
};

type SparseArray<T> = (T | undefined)[];

export const KeyboardNavigationProvider: FC<
  KeyboardNavigationProviderProps
> = ({ maxX, maxY = 0, initialX = 0, initialY = 0, children }) => {
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

  const onFocus = useCallback<OnFocus>(
    (position) => dispatch({ type: "onFocus", position }),
    []
  );

  const onBlur = useCallback<OnBlur>(() => dispatch({ type: "onBlur" }), []);

  const move = useEvent<Move>((direction) => {
    const focusables = getFocusables();

    if (direction === "current") {
      const focusable = focusables[position.x]?.[position.y];
      if (focusable) {
        focusable.focus();
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
      const focusable =
        focusables[isX ? i : position.x]?.[isX ? position.y : i];
      if (focusable) {
        focusable.focus();
        break;
      }
    }
  });

  const contextValueRef = useRef<ContextType>({
    register,
    onFocus,
    onBlur,
    move,
  });

  return (
    <KeyboardNavigationContext.Provider value={contextValueRef.current}>
      {typeof children === "function"
        ? children({ ...position, hasFocus: state.hasFocus })
        : children}
    </KeyboardNavigationContext.Provider>
  );
};

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
  | { id: string }
  | ((e: KeyboardEvent<E>) => void);

type Keys<E extends HTMLElement> = Partial<
  Record<Key, KeyAction<E> | [KeyAction<E>, Predicate<KeyboardEvent<E>>]>
>;

type KeyDownHandler<E extends HTMLElement> = (e: KeyboardEvent<E>) => void;

export const focusElementWithId = (id: string) => {
  document.getElementById(id)?.focus();
};

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
  const { register, onFocus, onBlur, move } = useContext(
    KeyboardNavigationContext
  );

  const focusableRef = useRef<Focusable | null>(null);

  // We need RefCallback because MutableRefObject don't work with Focusable type.
  // The ref is stable for better performance and more straightforward reasoning.
  const ref = useCallback<RefCallback<Focusable>>((focusable) => {
    focusableRef.current = focusable;
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!focusableRef.current) return;
    return register({ x, y }, focusableRef.current);
  }, [register, x, y]);

  const handleOnFocus = useEvent(() => onFocus({ x, y }));

  const handleOnBlur = useEvent(onBlur);

  const handleKeyDown = useEvent<KeyDownHandler<E>>((e) => {
    pipe(
      keys,
      record.lookup(e.key),
      option.map((arg) => (Array.isArray(arg) ? arg : ([arg, null] as const))),
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
  });

  return {
    ref,
    onFocus: handleOnFocus,
    onBlur: handleOnBlur,
    onKeyDown: handleKeyDown,
  };
};
