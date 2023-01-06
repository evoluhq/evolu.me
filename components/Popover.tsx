import clsx from "clsx";
import { IO } from "fp-ts/IO";
import {
  FC,
  MutableRefObject,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Dimensions, Modal } from "react-native";
import { bg, ring } from "../styles";
import { CloseButtonLayer } from "./CloseButtonLayer";
import { View } from "./styled";

type PopoverPosition =
  // what where
  | "bottom right to bottom right"
  | "bottom left to bottom right"
  | "top right to top right"
  | "top left to top right";

export type PopoverProps = {
  ownerRef: MutableRefObject<View | null>;
  position: PopoverPosition;
  yOffset?: number;
  onRequestClose: IO<void>;
  children: ReactNode;
};

interface XY {
  x: number;
  y: number;
}

export const Popover: FC<PopoverProps> = ({
  ownerRef,
  position,
  yOffset,
  onRequestClose,
  children,
}) => {
  const viewRef = useRef<View>(null);
  const [xy, setXY] = useState<XY | null>(null);

  useLayoutEffect(() => {
    if (ownerRef.current == null || viewRef.current == null) return;

    // This is web only for now.
    // Refactoring measureInWindow callbacks to Task would be better,
    // but this is good enough for now.
    const ownerEl = ownerRef.current as unknown as HTMLElement;
    const viewEl = viewRef.current as unknown as HTMLElement;

    const handleChange = () => {
      const ownerRect = ownerEl.getBoundingClientRect();

      const getXY = (): XY => {
        switch (position) {
          case "bottom right to bottom right":
            return {
              x: ownerRect.left - viewEl.offsetWidth + ownerRect.width,
              y: ownerRect.top - viewEl.offsetHeight + ownerRect.height,
            };
          case "bottom left to bottom right":
            return {
              x: ownerRect.left + ownerRect.width,
              y: ownerRect.top - viewEl.offsetHeight + ownerRect.height,
            };
          case "top right to top right":
            return {
              x: ownerRect.left - viewEl.offsetWidth + ownerRect.width,
              y: ownerRect.top - ownerRect.height + ownerRect.height,
            };
          case "top left to top right":
            return {
              x: ownerRect.left + ownerRect.width,
              y: ownerRect.top - ownerRect.height + ownerRect.height,
            };
        }
      };

      const xy = getXY();
      if (yOffset != null) xy.y += yOffset;
      setXY((previous) => {
        if (previous && xy.x === previous.x && xy.y === previous.y)
          return previous;
        return xy;
      });
    };

    handleChange();

    // https://github.com/necolas/react-native-web/issues/2430
    window.visualViewport?.addEventListener("resize", handleChange);
    const subscription = Dimensions.addEventListener("change", handleChange);
    return () => {
      window.visualViewport?.removeEventListener("resize", handleChange);
      subscription.remove();
    };
  }, [ownerRef, position, yOffset]);

  return (
    <Modal transparent onRequestClose={onRequestClose} visible>
      <View
        ref={viewRef}
        className={clsx("absolute", ring, bg)}
        style={xy ? { left: xy.x, top: xy.y } : { opacity: 0 }}
      >
        {children}
      </View>
      <CloseButtonLayer onPress={onRequestClose} />
    </Modal>
  );
};
