import {
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button, ButtonProps } from "./Button";
import { Popover, PopoverProps } from "./Popover";

export interface PopoverButtonRef {
  close: () => void;
}

export type PopoverButtonProps = Omit<ButtonProps, "onPress"> &
  Omit<PopoverProps, "anchorRef" | "children"> & {
    renderPopover: () => ReactNode;
  };

export const PopoverButton = forwardRef<PopoverButtonRef, PopoverButtonProps>(
  function PopoverButton(
    {
      renderPopover,
      onClose,
      anchorOrigin,
      transformOrigin,
      offsetStyle,
      margin,
      ...buttonProps
    },
    ref,
  ) {
    const buttonRef = useRef<HTMLElement>(null);
    const [popoverIsShown, setPopoverIsShown] = useState(false);

    const handlePopoverClose = useCallback(() => {
      setPopoverIsShown(false);
      if (onClose) onClose();
    }, [onClose]);

    const handleButtonPress = useCallback(() => {
      setPopoverIsShown(true);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        close: () => {
          handlePopoverClose();
        },
      }),
      [handlePopoverClose],
    );

    return (
      <>
        <Button ref={buttonRef} {...buttonProps} onPress={handleButtonPress} />
        {popoverIsShown && (
          <Popover
            onClose={handlePopoverClose}
            anchorRef={buttonRef}
            anchorOrigin={anchorOrigin}
            transformOrigin={transformOrigin}
            offsetStyle={offsetStyle}
            margin={margin}
          >
            {renderPopover()}
          </Popover>
        )}
      </>
    );
  },
);
