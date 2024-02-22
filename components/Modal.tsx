import { create, props } from "@stylexjs/stylex";
import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";

export interface ModalRef {
  close: () => void;
}

export interface ModalProps {
  children: ReactNode;
  onRequestClose?: (() => void) | undefined;
  background?: boolean;
  suppressRequestClose?: boolean;
}

export const Modal = forwardRef<ModalRef, ModalProps>(function Modal(
  { children, onRequestClose, background, suppressRequestClose },
  ref,
) {
  useImperativeHandle(
    ref,
    () => ({
      close: () => {
        if (suppressRequestClose) return;
        dialogRef.current?.close();
      },
    }),
    [suppressRequestClose],
  );

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const { current: dialog } = dialogRef;
    if (!dialog) return;

    const handleClose = () => {
      if (onRequestClose) onRequestClose();
    };

    const handleClick = (e: MouseEvent) => {
      if (suppressRequestClose) return;
      if (e.target === dialog) dialog.close();
    };

    const handleCancel = (e: Event) => {
      if (suppressRequestClose) e.preventDefault();
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleClick);
    dialog.addEventListener("cancel", handleCancel);

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, [onRequestClose, suppressRequestClose]);

  useLayoutEffect(() => {
    const { current: dialog } = dialogRef;
    if (!dialog) return;
    // It must be removed before calling showModal.
    dialog.removeAttribute("open");
    dialog.showModal();
  }, []);

  return (
    <dialog
      /**
       * Dialog has to be rendered open; otherwise, reading DOM values like
       * offsetWidth returns 0 because, without an open attribute, the Dialog
       * display style is set to none. Unfortunately, there is no attribute for
       * modality; the showModal method is the only way to make Dialog modal.
       */
      open
      {...props(styles.dialog, background && styles.background)}
      ref={dialogRef}
    >
      {children}
    </dialog>
  );
});

const styles = create({
  /**
   * https://www.smashingmagazine.com/2023/12/new-css-viewport-units-not-solve-classic-scrollbar-problem/
   * https://mastodon.social/@simevidas/110817721430296488
   */
  dialog: {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    maxWidth: "none",
    maxHeight: "none",
    borderWidth: 0,
    backgroundColor: "transparent",
    "::backdrop": {
      backgroundColor: "transparent",
    },
  },
  background: {
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
    // not sure...
    // backgroundColor: "rgba(0, 0, 0, .05)",
  },
});
