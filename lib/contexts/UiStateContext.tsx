import { FC, ReactNode, RefObject, createContext, useRef } from "react";
import { CarouselRef } from "../../components/Carousel";

export interface UiState {
  dayWeek: {
    todayAttentionAnimation: Animation | null;
    carouselRef: RefObject<CarouselRef>;
  };
}

const createInitialValue = (): UiState => ({
  dayWeek: {
    todayAttentionAnimation: null,
    carouselRef: { current: null },
  },
});

/**
 * A shared mutable state isn't always the root of all evil. This is for
 * harmless side effects like UI animations, focuses, scrolls, etc.
 */
export const UiStateContext = createContext(createInitialValue());

export const UiStateProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const ref = useRef(createInitialValue());

  return (
    <UiStateContext.Provider value={ref.current}>
      {children}
    </UiStateContext.Provider>
  );
};
