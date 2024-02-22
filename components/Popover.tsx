import { StyleXStyles, create, props } from "@stylexjs/stylex";
import {
  FC,
  ReactNode,
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { Dimensions } from "react-native";
import { colors, shadows, spacing } from "../lib/Tokens.stylex";
import { devBaseline } from "../lib/devBaseline";
import { Hr } from "./Hr";
import { Modal } from "./Modal";

export interface PopoverProps {
  children: ReactNode;
  onClose?: () => void;
  anchorRef: RefObject<HTMLElement>;
  anchorOrigin?: AnchorOrigin | undefined;
  transformOrigin?: TransformOrigin | undefined;
  offsetStyle?: StyleXStyles<{ translate: string }> | undefined;
  /**
   * It could be StyleXStyles computed on an invisible element, but it's
   * unnecessary, I suppose.
   */
  margin?: number | undefined;
}

export interface AnchorOrigin {
  block: AlignmentPoint;
  inline: AlignmentPoint;
}

export interface TransformOrigin {
  block: AlignmentPoint;
  inline: AlignmentPoint;
}

export type AlignmentPoint = "start" | "center" | "end";

export interface Position {
  top: number;
  left: number;
}

export const Popover: FC<PopoverProps> = ({
  children,
  onClose,
  anchorRef,
  anchorOrigin = { block: "end", inline: "start" },
  transformOrigin = { block: "start", inline: "start" },
  offsetStyle: offset,
  margin = 8,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  const getPosition = useCallback((): Position | null => {
    const popover = popoverRef.current;
    if (!popover || !anchorRef.current) return null;
    const anchorRect = anchorRef.current.getBoundingClientRect();

    let top = anchorRect.top;
    let left = anchorRect.left;

    if (anchorOrigin.block === "center") top += anchorRect.height / 2;
    else if (anchorOrigin.block === "end") top += anchorRect.height;

    if (anchorOrigin.inline === "center") left += anchorRect.width / 2;
    else if (anchorOrigin.inline === "end") left += anchorRect.width;

    if (transformOrigin.block === "center") top -= popover.offsetHeight / 2;
    else if (transformOrigin.block === "end") top -= popover.offsetHeight;

    if (transformOrigin.inline === "center") left -= popover.offsetWidth / 2;
    else if (transformOrigin.inline === "end") left -= popover.offsetWidth;

    const bottom = top + popover.offsetHeight;
    const right = left + popover.offsetWidth;
    const { height, width } = Dimensions.get("window");

    const marginHeight = popover.offsetHeight + 2 * margin;
    if (marginHeight > height) left -= (marginHeight - height) / 2;
    else if (top < margin) top = margin;
    else if (bottom + margin > height) top -= bottom + margin - height;

    const marginWidth = popover.offsetWidth + 2 * margin;
    if (marginWidth > width) left -= (marginWidth - width) / 2;
    else if (left < margin) left = margin;
    else if (right + margin > width) left -= right + margin - width;

    return { top, left };
  }, [
    anchorOrigin.block,
    anchorOrigin.inline,
    anchorRef,
    margin,
    transformOrigin.block,
    transformOrigin.inline,
  ]);

  const lastPositionRef = useRef<Position | null>();

  const position = useSyncExternalStore(
    subscribeResize,
    useCallback(() => {
      const position = getPosition();
      // Must be cached for useSyncExternalStore.
      if (
        position &&
        lastPositionRef.current &&
        lastPositionRef.current.left === position.left &&
        lastPositionRef.current.top === position.top
      )
        return lastPositionRef.current;
      lastPositionRef.current = position;
      return position;
    }, [getPosition]),
  );

  // Disable body scrolling.
  useLayoutEffect(() => {
    document.documentElement.classList.add("overflow-hidden");
    return () => {
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <Modal onRequestClose={onClose}>
      <div {...props(styles.closeButton)} onClick={onClose} />
      <div
        {...props(
          styles.popover,
          offset,
          position ? styles.position(position) : styles.hidden,
        )}
        ref={popoverRef}
      >
        {children}
      </div>
    </Modal>
  );
};

export const PopoverContainer: FC<{
  children: ReactNode;
  style?: StyleXStyles;
}> = ({ children, style }) => {
  return (
    <div {...props([styles.container, style, false && devBaseline(true)])}>
      {children}
    </div>
  );
};

export const PopoverHeader: FC<{ children: ReactNode }> = ({ children }) => {
  return <div {...props(styles.header)}>{children}</div>;
};

export const PopoverFooter: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Hr />
      <div {...props(styles.footer)}>{children}</div>
    </>
  );
};

const styles = create({
  /**
   * This is required for iOS Safari to not show focus-visible styles on
   * buttons. Dialog, for some reason, doesn't need it.
   */
  closeButton: {
    position: "absolute",
    inset: 0,
  },
  popover: {
    position: "absolute",
    backgroundColor: colors.background,
    borderRadius: spacing.xxxs,
    boxShadow: `0 0 0 1px ${colors.borderLighter}, ${shadows.shadow3}`,
  },
  position: (position: Position) => ({
    left: position.left,
    top: position.top,
  }),
  hidden: {
    opacity: 0,
    left: 0,
    right: 0,
  },
  container: {
    /** It can't be bigger because seven buttons wouldn't fit on a 320px screen. */
    paddingInline: spacing.xxxs,
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const subscribeResize = (onStoreChange: () => void): (() => void) => {
  const subscription = Dimensions.addEventListener("change", onStoreChange);
  // Popover disables scrolling, do we need scrolling?
  // const handleWindowScroll = () => {
  //   onStoreChange();
  // };
  // window.addEventListener("scroll", handleWindowScroll);
  return () => {
    subscription.remove();
    // window.removeEventListener("scroll", handleWindowScroll);
  };
};
