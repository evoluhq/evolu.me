import clsx from "clsx";
import { IO } from "fp-ts/IO";
import {
  FC,
  MutableRefObject,
  ReactNode,
  useRef,
  useSyncExternalStore,
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
  | "top right to top left"
  | "top left to top right";

export type PopoverProps = {
  ownerRef: MutableRefObject<View | null>;
  position: PopoverPosition;
  onRequestClose: IO<void>;
  children: ReactNode;
};

interface XY {
  x: number;
  y: number;
}

const subscribe = (onChange: IO<void>) => {
  // https://github.com/necolas/react-native-web/issues/2430
  window.visualViewport?.addEventListener("resize", onChange);
  const subscription = Dimensions.addEventListener("change", onChange);
  return () => {
    window.visualViewport?.removeEventListener("resize", onChange);
    subscription.remove();
  };
};

export const Popover: FC<PopoverProps> = ({
  ownerRef,
  position,
  onRequestClose,
  children,
}) => {
  const viewRef = useRef<View>(null);

  const getXY = (): XY | null => {
    if (ownerRef.current == null || viewRef.current == null) return null;

    // This is web only for now.
    // Refactoring measureInWindow callbacks to Task would be better,
    // but this is good enough for now.
    const ownerEl = ownerRef.current as unknown as HTMLElement;
    const viewEl = viewRef.current as unknown as HTMLElement;

    const ownerRect = ownerEl.getBoundingClientRect();

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
      case "top right to top left":
        return {
          x: ownerRect.left - viewEl.offsetWidth,
          y: ownerRect.top - ownerRect.height + ownerRect.height,
        };
      case "top left to top right":
        return {
          x: ownerRect.left + ownerRect.width,
          y: ownerRect.top - ownerRect.height + ownerRect.height,
        };
    }
  };

  const lastXyRef = useRef<XY | null>();

  const xy = useSyncExternalStore<XY | null>(subscribe, () => {
    const xy = getXY();
    if (
      lastXyRef.current &&
      xy &&
      lastXyRef.current.x === xy.x &&
      lastXyRef.current.y === xy.y
    )
      return lastXyRef.current;
    lastXyRef.current = xy;
    return xy;
  });

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
