import { IO } from "fp-ts/IO";
import {
  FC,
  ForwardedRef,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Dimensions, Modal, View } from "react-native";
import { CloseButtonLayer } from "./CloseButtonLayer";
import { Ring } from "./Ring";

export type PopoverProps = {
  ownerRef: ForwardedRef<View>;
  position: "bottom right to left" | "bottom right to right";
  onRequestClose: IO<void>;
  children: ReactNode;
};

interface XY {
  x: number;
  y: number;
}

export const Popover: FC<PopoverProps> = ({
  onRequestClose,
  children,
  position,
  ownerRef,
}) => {
  const viewRef = useRef<View>(null);
  const [xy, setXY] = useState<XY | null>(null);

  // This is web only for now.
  useLayoutEffect(() => {
    if (
      ownerRef == null ||
      typeof ownerRef === "function" ||
      ownerRef.current == null ||
      viewRef.current == null
    )
      return;

    // Refactor measureInWindow callbacks to Task would be better,
    // but this is good enough for now.
    const ownerEl = ownerRef.current as unknown as HTMLElement;
    const viewEl = viewRef.current as unknown as HTMLElement;

    const handleChange = () => {
      const ownerRect = ownerEl.getBoundingClientRect();
      const xy =
        position === "bottom right to left"
          ? {
              x: ownerRect.left - viewEl.offsetWidth + ownerRect.width,
              y: ownerRect.top - viewEl.offsetHeight + ownerRect.height,
            }
          : {
              x: ownerRect.left + ownerRect.width,
              y: ownerRect.top - viewEl.offsetHeight + ownerRect.height,
            };
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
  }, [ownerRef, position]);

  return (
    <Modal transparent onRequestClose={onRequestClose} visible>
      <View
        ref={viewRef}
        style={{
          position: "absolute",
          ...(!xy ? { opacity: 0 } : { left: xy.x, top: xy.y }),
        }}
      >
        <Ring>{children}</Ring>
      </View>
      <CloseButtonLayer onPress={onRequestClose} />
    </Modal>
  );
};
