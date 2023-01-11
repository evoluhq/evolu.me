import { constUndefined, constVoid } from "fp-ts/function";
import {
  createContext,
  FC,
  RefObject,
  useCallback,
  useContext,
  useRef,
} from "react";
import {
  NativeScrollEvent,
  NativeScrollPoint,
  NativeSyntheticEvent,
} from "react-native";
import { ScrollView } from "../../components/styled";
import { FocusPosition } from "./useKeyNavigation";

interface ContextType {
  storeScroll: (id: string, position?: FocusPosition) => void;
  restoreScroll: (id: string) => FocusPosition | undefined;
}

export const ScrollRestorationContext = createContext<ContextType>({
  storeScroll: constVoid,
  restoreScroll: constUndefined,
});

export const ScrollRestoration: FC<{
  children: (props: {
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
    ref: RefObject<ScrollView>;
    scrollEventThrottle: 0;
  }) => JSX.Element;
}> = ({ children }) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollPointRef = useRef<NativeScrollPoint>();

  const scrollPointsRef = useRef<
    Map<
      string,
      {
        point?: NativeScrollPoint;
        position?: FocusPosition;
      }
    >
  >();

  const getScrollPoints = () => {
    if (!scrollPointsRef.current) scrollPointsRef.current = new Map();
    return scrollPointsRef.current;
  };

  const handleScrollViewScroll = useCallback(
    ({
      nativeEvent: { contentOffset },
    }: NativeSyntheticEvent<NativeScrollEvent>) => {
      // contentOffset must be clonned for some reason
      scrollPointRef.current = { x: contentOffset.x, y: contentOffset.y };
    },
    []
  );

  const storeScroll = useCallback((id: string, position?: FocusPosition) => {
    getScrollPoints().set(id, { point: scrollPointRef.current, position });
  }, []);

  const restoreScroll = useCallback((id: string) => {
    const scrollPoint = getScrollPoints().get(id);
    if (!scrollPoint) return undefined;
    if (scrollPoint.point && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        ...scrollPoint.point,
        animated: false,
      });
    }
    return scrollPoint.position;
  }, []);

  const contextValueRef = useRef<ContextType>();
  const getContextValue = () => {
    if (!contextValueRef.current)
      contextValueRef.current = {
        storeScroll,
        restoreScroll,
      };
    return contextValueRef.current;
  };

  return (
    <ScrollRestorationContext.Provider value={getContextValue()}>
      {children({
        onScroll: handleScrollViewScroll,
        ref: scrollViewRef,
        scrollEventThrottle: 0,
      })}
    </ScrollRestorationContext.Provider>
  );
};

export const useScrollRestoration = () => useContext(ScrollRestorationContext);
