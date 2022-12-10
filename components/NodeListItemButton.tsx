import clsx from "clsx";
import { readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { FC, MutableRefObject, useRef, useState } from "react";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import { Button } from "../components/Button";
import { Popover } from "../components/Popover";
import { NodeId, useMutation } from "../lib/db";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";
import { requestNodeListFocus } from "./NodeListFocus";
import { View } from "./styled";
import { Text } from "./Text";

const NodeListItemButtonPopoverButton: FC<{
  title: string;
  x: number;
  onPress: IO<void>;
  className?: string;
  onRequestClose?: IO<void>;
}> = ({ title, x, onPress, className /*onRequestClose*/ }) => {
  const keyNavigation = useKeyNavigation({
    x,
    keys: {
      ArrowLeft: "previousX",
      ArrowRight: "nextX",
    },
  });

  return (
    <Button {...keyNavigation} onPress={onPress}>
      <Text as="button" className={clsx("my-0 py-[8px]", className)}>
        {title}
      </Text>
    </Button>
  );
};

const NodeListItemButtonPopover: FC<{
  id: NodeId;
  onRequestClose: IO<void>;
  ownerRef: MutableRefObject<View | null>;
}> = ({ id, onRequestClose, ownerRef }) => {
  const intl = useIntl();
  const { mutate } = useMutation();

  const handleDeletePress = () => {
    mutate("node", { id, isDeleted: true }, () => {
      requestNodeListFocus("current");
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const focusHref = pipe(
    useLocationHashNodeIds(),
    readonlyArray.append(id),
    nodeIdsToLocationHash,
    (s) => `/#${s}`
  );

  return (
    <Popover
      ownerRef={ownerRef}
      position="bottom left to bottom right"
      // yOffset={-4}
      onRequestClose={onRequestClose}
    >
      <View className="flex-row">
        <KeyboardNavigationProvider maxX={2}>
          <NodeListItemButtonPopoverButton
            title={intl.formatMessage({
              defaultMessage: "Delete",
              id: "K3r6DQ",
            })}
            x={0}
            onPress={handleDeletePress}
            className="rounded-none rounded-l"
          />
          <NodeListItemButtonPopoverButton
            title={intl.formatMessage({
              defaultMessage: "Add",
              id: "2/2yg+",
            })}
            x={1}
            onPress={handleDeletePress}
            className="rounded-none"
          />
          <NodeListItemButtonPopoverButton
            title={intl.formatMessage({
              defaultMessage: "Edit",
              id: "wEQDC6",
            })}
            x={2}
            onPress={handleDeletePress}
            className="rounded-none rounded-r"
          />
        </KeyboardNavigationProvider>
      </View>
    </Popover>
  );
};

export interface NodeListItemButton {
  focusable: boolean;
  id: NodeId;
  x: number;
}

export const NodeListItemButton: FC<NodeListItemButton> = ({
  focusable,
  id,
  x,
}) => {
  const intl = useIntl();
  const [popoverIsVisible, setPopoverIsVisible] = useState(false);

  const buttonKeyNavigation = useKeyNavigation({
    x,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: "nextX",
      ArrowRight: "nextY",
    },
  });

  const buttonRef = useRef<View | null>(null);
  const handleRef = useEvent((view: View | null) => {
    buttonKeyNavigation.ref(view);
    buttonRef.current = view;
  });

  return (
    <>
      <Button
        accessibilityLabel={intl.formatMessage({
          defaultMessage: "Show popover",
          id: "opkU9o",
        })}
        className="group w-9 items-center"
        {...buttonKeyNavigation}
        ref={handleRef}
        onPress={() => setPopoverIsVisible(true)}
        focusable={focusable}
      >
        <View
          className={clsx(
            "top-[17px] h-3 w-3 rounded-sm ring-current group-focus-visible:ring-1",
            "bg-gray-200 group-hover:bg-gray-300",
            "dark:bg-gray-800 dark:group-hover:bg-gray-900",
            popoverIsVisible && "rotate-45"
          )}
        />
      </Button>
      {popoverIsVisible && (
        <NodeListItemButtonPopover
          id={id}
          onRequestClose={() => setPopoverIsVisible(false)}
          ownerRef={buttonRef}
        />
      )}
    </>
  );
};
