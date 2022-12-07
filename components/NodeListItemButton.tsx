import clsx from "clsx";
import { readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { FC, ForwardedRef, forwardRef, KeyboardEvent, useState } from "react";
import { useIntl } from "react-intl";
import { View as RnView } from "react-native";
import { Button } from "../components/Button";
import { Popover } from "../components/Popover";
import { View } from "../components/styled";
import { NodeId, useMutation } from "../lib/db";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";
import { Text } from "./Text";

const NodeListItemButtonPopoverButton: FC<{
  title: string;
  x: number;
  onPress: IO<void>;
  className?: string;
  onRequestClose?: IO<void>;
}> = ({ title, x, onPress, className /*onRequestClose*/ }) => {
  const keyNavigation = useKeyNavigation<RnView>({
    x,
    keys: { ArrowLeft: "previousX", ArrowRight: "nextX" },
  });

  return (
    <Button {...keyNavigation} onPress={onPress}>
      <Text
        as="button"
        // py-1 my-1
        className={clsx("my-0 py-2", className)}
        //  customClassName={customClassName}
      >
        {title}
      </Text>
    </Button>
  );
};

const NodeListItemButtonPopover: FC<{
  id: NodeId;
  onRequestClose: IO<void>;
  ownerRef: ForwardedRef<RnView>;
}> = ({ id, onRequestClose, ownerRef }) => {
  const intl = useIntl();
  const { mutate } = useMutation();
  //   const { move } = useContext(KeyboardNavigationContext);

  const handleDeletePress = () => {
    mutate("node", { id, isDeleted: true }, () => {
      //   setSafeTimeout(() => move("current"));
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
      yOffset={-4}
      onRequestClose={onRequestClose}
    >
      <View className="flex-row">
        <KeyboardNavigationProvider maxX={2}>
          {/* <NodeListItemButtonPopoverButton
            title={intl.formatMessage({
              defaultMessage: "Focus",
              id: "hsJlm7",
            })}
            x={0}
            onPress={focusHref}
            customClassName="rounded-none rounded-l"
            onRequestClose={onRequestClose}
          /> */}
          {/* <NodeListItemButtonPopoverButton
            title="Move"
            x={1}
            onPress={constVoid}
            customClassName="rounded-none"
          /> */}
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
              defaultMessage: "Edit",
              id: "wEQDC6",
            })}
            x={1}
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
  onFocus: IO<void>;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  id: NodeId;
  title: string;
}

export const NodeListItemButton = forwardRef<RnView, NodeListItemButton>(
  function NodeListItemButton({ focusable, onFocus, onKeyDown, id }, ref) {
    const intl = useIntl();
    const [popoverIsVisible, setPopoverIsVisible] = useState(false);

    return (
      <>
        <Button
          accessibilityLabel={intl.formatMessage({
            defaultMessage: "Show popover",
            id: "opkU9o",
          })}
          className="group w-9 items-center"
          onFocus={onFocus}
          // @ts-expect-error RNfW
          onKeyDown={onKeyDown}
          focusable={focusable}
          ref={ref}
          onPress={() => setPopoverIsVisible(true)}
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
            ownerRef={ref}
          />
        )}
      </>
    );
  }
);
