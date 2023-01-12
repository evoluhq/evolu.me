import { useRouter } from "next/router";
import { FC, useRef, useState } from "react";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import { NodeId } from "../lib/db";
import { useKeyNavigation } from "../lib/hooks/useKeyNavigation";
import { NodeItemButtonPopover } from "./NodeItemButtonPopover";
import { BlankButton } from "./BlankButton";
import { View } from "./styled";

export interface NodeItemButtonProps {
  focusable: boolean;
  id: NodeId;
  x: number;
  isLast: boolean;
}

export const NodeItemButton: FC<NodeItemButtonProps> = ({
  focusable,
  id,
  x,
  isLast,
}) => {
  const intl = useIntl();
  const [popoverIsVisible, setPopoverIsVisible] = useState(false);
  const router = useRouter();

  const buttonKeyNavigation = useKeyNavigation({
    x,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: "nextX",
      ArrowRight: "nextY",
      Escape: () => router.back(),
    },
  });

  const buttonRef = useRef<View | null>(null);
  const handleRef = useEvent((view: View | null) => {
    buttonKeyNavigation.ref(view);
    buttonRef.current = view;
  });

  return (
    <>
      <BlankButton
        type="square"
        title={intl.formatMessage({
          defaultMessage: "Show connected node actions",
          id: "8G/aQx",
        })}
        {...buttonKeyNavigation}
        ref={handleRef}
        onPress={() => setPopoverIsVisible(true)}
        focusable={focusable}
        state={popoverIsVisible ? "active" : undefined}
      />
      {popoverIsVisible && (
        <NodeItemButtonPopover
          id={id}
          onRequestClose={() => setPopoverIsVisible(false)}
          ownerRef={buttonRef}
          isLast={isLast}
        />
      )}
    </>
  );
};
