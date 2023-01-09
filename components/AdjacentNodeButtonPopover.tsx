import clsx from "clsx";
import { readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useRouter } from "next/router";
import { FC, MutableRefObject, useContext } from "react";
import { useIntl } from "react-intl";
import { createEdge, NodeId, useMutation, useQuery } from "../lib/db";
import {
  KeyboardNavigationContext,
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";
import { Button } from "./Button";
import { Popover } from "./Popover";
import { View } from "./styled";
import { Text } from "./Text";

const PopoverButton: FC<{
  title: string;
  x: number;
  onPress: IO<void>;
  className?: string;
}> = ({ title, x, onPress, className }) => {
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

export const AdjacentNodeButtonPopover: FC<{
  id: NodeId;
  onRequestClose: IO<void>;
  ownerRef: MutableRefObject<View | null>;
}> = ({ id, onRequestClose, ownerRef }) => {
  const intl = useIntl();
  const { mutate } = useMutation();

  const locationNodeIds = useLocationHashNodeIds();

  const router = useRouter();

  const handleAddToContextPress = () => {
    pipe(
      locationNodeIds,
      readonlyArray.append(id),
      nodeIdsToLocationHash,
      (hash) => {
        router.push(`/#${hash}`);
      }
    );
  };

  const { move } = useContext(KeyboardNavigationContext);

  const handleDeletePress = () => {
    mutate("node", { id, isDeleted: true }, () => {
      move("current", true);
    });
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
        <KeyboardNavigationProvider maxX={hasAdjacentNodes ? 2 : 0}>
          <PopoverButton
            title={intl.formatMessage({
              defaultMessage: "Delete",
              id: "K3r6DQ",
            })}
            x={0}
            onPress={handleDeletePress}
            className={clsx(hasAdjacentNodes && "rounded-r-none")}
          />
          {hasAdjacentNodes && (
            <>
              <PopoverButton
                title={intl.formatMessage({
                  defaultMessage: "With",
                  id: "E8dH1q",
                })}
                x={1}
                onPress={handleAddToContextPress}
                className={hasAdjacentNodes ? "rounded-none" : "rounded-l-none"}
              />
              <PopoverButton
                title={intl.formatMessage({
                  defaultMessage: "Remove",
                  id: "G/yZLu",
                })}
                x={2}
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
