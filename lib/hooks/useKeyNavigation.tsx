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
  useReducer,
  useRef,
} from "react";
import useEvent from "react-use-event-hook";
import { BRAND } from "zod";

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

type Register = (position: Position, focusable: Focusable) => void;

type Unregister = (position: Position) => void;

type OnFocus = (position: Position) => void;

type MoveDirection = "nextX" | "previousX" | "nextY" | "previousY" | "current";

type Move = (direction: MoveDirection) => void;

interface ContextType {
  register: Register;
  unregister: Unregister;
  onFocus: OnFocus;
  move: Move;
}

export const KeyboardNavigationContext = createContext<ContextType>({
  register: () => constVoid,
  unregister: () => constVoid,
  onFocus: () => constVoid,
  move: constVoid,
});

/** Limit `x` and `y` to ensure focus is not lost. */
interface PositionBounds {
  maxX: number;
  maxY: number;
}

// // https://dev.to/gcanti/functional-design-smart-constructors-14nb
const createSafePosition = ({
  x,
  y,
  maxX,
  maxY,
}: Position & PositionBounds): BoundedPosition =>
  ({
    x: bounded.clamp({ ...number.Ord, bottom: 0, top: maxX })(x),
    y: bounded.clamp({ ...number.Ord, bottom: 0, top: maxY })(y),
  } as BoundedPosition);

export interface KeyboardNavigationProviderProps {
  maxX: number;
  maxY?: number;
  initialX?: number;
  initialY?: number;
  children: ReactNode | ((position: BoundedPosition) => ReactNode);
}

type SparseArray<T> = (T | undefined)[];

export const KeyboardNavigationProvider: FC<
  KeyboardNavigationProviderProps
> = ({ maxX, maxY = 0, initialX = 0, initialY = 0, children }) => {
  // https://twitter.com/dan_abramov/status/1102010979611746304
  const reducer: Reducer<
    BoundedPosition,
    { type: "onFocus"; position: Position }
  > = (state, action) => {
    let nextState;
    switch (action.type) {
      case "onFocus":
        nextState = createSafePosition({ ...action.position, maxX, maxY });
        break;
    }
    return nextState.x === state.x && nextState.y === state.y
      ? state
      : nextState;
  };

  const [position, dispatch] = useReducer(reducer, null, () =>
    createSafePosition({ x: initialX, y: initialY, maxX, maxY })
  );

  const focusablesRef = useRef<SparseArray<SparseArray<Focusable>>>();
  const getFocusables = () => {
    if (!focusablesRef.current) focusablesRef.current = [];
    return focusablesRef.current;
  };

  const register: Register = useCallback(({ x, y }, focusable) => {
    const focusables = getFocusables();
    const yFocusables = focusables[x] || (focusables[x] = []);
    yFocusables[y] = focusable;
  }, []);

  const unregister: Unregister = useCallback(({ x, y }) => {
    const focusables = getFocusables();
    const yFocusables = focusables[x] || (focusables[x] = []);
    delete yFocusables[y];
  }, []);

  const onFocus: OnFocus = useCallback(
    (position) => dispatch({ type: "onFocus", position }),
    []
  );

  const move: Move = useEvent((direction) => {
    if (direction === "current") {
      const focusable = getFocusables()[position.x]?.[position.y];
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
        getFocusables()[isX ? i : position.x]?.[isX ? position.y : i];
      if (focusable) {
        focusable.focus();
        break;
      }
    }
  });

  const contextValueRef = useRef<ContextType>({
    register,
    unregister,
    onFocus,
    move,
  });

  return (
    <KeyboardNavigationContext.Provider value={contextValueRef.current}>
      {typeof children === "function" ? children(position) : children}
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
  | MoveDirection
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
  const { register, unregister, onFocus, move } = useContext(
    KeyboardNavigationContext
  );

  // https://beta.reactjs.org/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback
  // https://tkdodo.eu/blog/avoiding-use-effect-with-callback-refs
  const ref = useEvent<RefCallback<Focusable>>((focusable) => {
    if (focusable) register({ x, y }, focusable);
    else unregister({ x, y });
  });

  const handleOnFocus = useEvent(() => onFocus({ x, y }));

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

  const keyNavigationRef = useRef<KeyNavigation<E>>();
  if (!keyNavigationRef.current)
    keyNavigationRef.current = {
      ref,
      onFocus: handleOnFocus,
      onKeyDown: handleKeyDown,
    };

  return keyNavigationRef.current;
};
