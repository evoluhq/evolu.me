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
  requestScrollToEndAnimated: () => void;
  scrollToEndAnimatedIfRequested: () => void;
}

export const ScrollRestorationContext = createContext<ContextType>({
  storeScroll: constVoid,
  restoreScroll: constUndefined,
  requestScrollToEndAnimated: constVoid,
  scrollToEndAnimatedIfRequested: constVoid,
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
    if (scrollPoint.point)
      scrollViewRef.current?.scrollTo({
        ...scrollPoint.point,
        animated: false,
      });
    return scrollPoint.position;
  }, []);

  const requestScrollToEndAnimatedRef = useRef(false);

  const requestScrollToEndAnimated = useCallback(() => {
    requestScrollToEndAnimatedRef.current = true;
  }, []);

  const scrollToEndAnimatedIfRequested = useCallback(() => {
    if (!requestScrollToEndAnimatedRef.current) return;
    requestScrollToEndAnimatedRef.current = false;
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  const contextValueRef = useRef<ContextType>();
  const getContextValue = () => {
    if (!contextValueRef.current)
      contextValueRef.current = {
        storeScroll,
        restoreScroll,
        requestScrollToEndAnimated,
        scrollToEndAnimatedIfRequested,
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
