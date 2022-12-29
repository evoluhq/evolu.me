import clsx from "clsx";
import { NonEmptyString1000 } from "evolu";
import { readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import {
  FC,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import { editNodeAtom } from "../lib/atoms";
import { createEdge, NodeId, useMutation, useQuery } from "../lib/db";
import { focusClassName } from "../lib/focusClassNames";
import {
  KeyboardNavigationContext,
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHash } from "../lib/hooks/useLocationHash";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";
import { Button } from "./Button";
import { Popover } from "./Popover";
import { View } from "./styled";
import { Text } from "./Text";

const NodeItemButtonPopoverButton: FC<{
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
      <Text as="button" className={clsx("my-0 py-2", className)}>
        {title}
      </Text>
    </Button>
  );
};

const NodeItemButtonPopover: FC<{
  id: NodeId;
  onRequestClose: IO<void>;
  ownerRef: MutableRefObject<View | null>;
  title: NonEmptyString1000;
}> = ({ id, onRequestClose, ownerRef, title }) => {
  const intl = useIntl();
  const { mutate } = useMutation();

  const hash = useLocationHash();
  const prevHashRef = useRef(hash);
  useEffect(() => {
    if (hash === prevHashRef.current) return;
    prevHashRef.current = hash;
    onRequestClose();
  });

  const locationNodeIds = useLocationHashNodeIds();

  const router = useRouter();

  const handleFilterPress = () => {
    pipe(
      locationNodeIds,
      readonlyArray.append(id),
      nodeIdsToLocationHash,
      (s) => `/#${s}`,
      (url) => {
        router.push(url);
      }
    );
  };

  const { move } = useContext(KeyboardNavigationContext);

  const handleDeletePress = () => {
    mutate("node", { id, isDeleted: true }, () => {
      move("current", true);
    });
  };

  const [editNode, setEditNode] = useAtom(editNodeAtom);

  const handleEditPress = () => {
    onRequestClose();
    if (!editNode) {
      flushSync(() => {
        setEditNode({ id, title, originalTitle: title });
      });
    }
    // setTimeout, because onRequestClose Modal moves the focus back.
    focusClassName("createNodeInput")(); // prevents NodeItemButton focus flash
    setTimeout(focusClassName("createNodeInput"));
  };

  const { rows: edgeIdsRows, isLoaded } = useQuery((db) => {
    const [a, b] = pipe(
      locationNodeIds,
      readonlyArray.map((locationNodeId) => createEdge(locationNodeId, id)),
      readonlyArray.map(({ a, b }) => [a, b] as const),
      readonlyArray.unzip
    );

    return db
      .selectFrom("edge")
      .select("id")
      .where("a", "in", a)
      .where("b", "in", b);
  });

  const handleRemovePress = () => {
    if (!isLoaded) return;
    edgeIdsRows.forEach(({ id }) => {
      mutate("edge", { id, isDeleted: true }, () => {
        move("current", true);
      });
    });
  };

  const hasAdjacentNodes = locationNodeIds.length > 0;

  return (
    <Popover
      ownerRef={ownerRef}
      position="top left to top right"
      onRequestClose={onRequestClose}
    >
      <View className="flex-row">
        <KeyboardNavigationProvider maxX={hasAdjacentNodes ? 3 : 1}>
          <NodeItemButtonPopoverButton
            title={intl.formatMessage({
              defaultMessage: "Delete",
              id: "K3r6DQ",
            })}
            x={0}
            onPress={handleDeletePress}
            className="rounded-r-none"
          />
          <NodeItemButtonPopoverButton
            title={intl.formatMessage({
              defaultMessage: "Edit",
              id: "wEQDC6",
            })}
            x={1}
            onPress={handleEditPress}
            className="rounded-none"
          />
          {hasAdjacentNodes && (
            <>
              <NodeItemButtonPopoverButton
                title={intl.formatMessage({
                  defaultMessage: "Filter",
                  id: "9Obw6C",
                })}
                x={2}
                onPress={handleFilterPress}
                className={hasAdjacentNodes ? "rounded-none" : "rounded-l-none"}
              />
              <NodeItemButtonPopoverButton
                title={intl.formatMessage({
                  defaultMessage: "Remove",
                  id: "G/yZLu",
                })}
                x={3}
                onPress={handleRemovePress}
                className="rounded-l-none"
              />
            </>
          )}
        </KeyboardNavigationProvider>
      </View>
    </Popover>
  );
};

export interface NodeItemButton {
  focusable: boolean;
  id: NodeId;
  x: number;
  isFirst: boolean;
  isLast: boolean;
  title: NonEmptyString1000;
}

export const NodeItemButton: FC<NodeItemButton> = ({
  focusable,
  id,
  x,
  isFirst,
  isLast,
  title,
}) => {
  const intl = useIntl();
  const [popoverIsVisible, setPopoverIsVisible] = useState(false);
  const router = useRouter();

  const buttonKeyNavigation = useKeyNavigation({
    x,
    keys: {
      ArrowUp: !isFirst ? "previousX" : focusClassName("firstNodeFilterLink"),
      ArrowDown: !isLast ? "nextX" : focusClassName("createNodeInput"),
      ArrowRight: "nextY",
      Escape: () => router.back(),
    },
  });

  const buttonRef = useRef<View | null>(null);
  const handleRef = useEvent((view: View | null) => {
    buttonKeyNavigation.ref(view);
    buttonRef.current = view;
  });

  const handleRequestClose = useCallback(() => {
    setPopoverIsVisible(false);
  }, []);

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
        <NodeItemButtonPopover
          id={id}
          onRequestClose={handleRequestClose}
          ownerRef={buttonRef}
          title={title}
        />
      )}
    </>
  );
};
