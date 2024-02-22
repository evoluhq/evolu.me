import { create, props } from "@stylexjs/stylex";
import {
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
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

  const onRequestCloseRef = useRef(onRequestClose);
  const suppressRequestCloseRef = useRef(suppressRequestClose);
  useEffect(() => {
    onRequestCloseRef.current = onRequestClose;
    suppressRequestCloseRef.current = suppressRequestClose;
  });

  /**
   * This must be run once because dialog.showModal() can't be called when
   * dialog is already shown.
   */
  useEffect(() => {
    const { current: dialog } = dialogRef;
    if (!dialog) return;

    const handleClose = () => {
      if (onRequestCloseRef.current) onRequestCloseRef.current();
    };

    const handleClick = (e: MouseEvent) => {
      if (suppressRequestCloseRef.current) return;
      if (e.target === dialog) dialog.close();
    };

    const handleCancel = (e: Event) => {
      if (suppressRequestCloseRef.current) e.preventDefault();
    };

    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleClick);
    dialog.addEventListener("cancel", handleCancel);

    dialog.showModal();

    return () => {
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleClick);
      dialog.removeEventListener("cancel", handleCancel);
    };
  }, []);

  return (
    <dialog
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
