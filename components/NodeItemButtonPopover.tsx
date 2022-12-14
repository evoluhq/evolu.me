import clsx from "clsx";
import { readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useRouter } from "next/router";
import { FC, MutableRefObject, useContext } from "react";
import { useIntl } from "react-intl";
import { createEdge, NodeId, useMutation, useQuery } from "../lib/db";
import { focusId } from "../lib/focusIds";
import {
  KeyboardNavigationContext,
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";
import {
  useQueryNodesByContextNodesSortedByCreatedAtDesc,
  useQueryNodesByIds,
} from "../lib/queries";
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

interface NodeItemButtonPopover {
  id: NodeId;
  onRequestClose: IO<void>;
  ownerRef: MutableRefObject<View | null>;
  isLast: boolean;
}

export const NodeItemButtonPopover: FC<NodeItemButtonPopover> = ({
  id,
  onRequestClose,
  ownerRef,
  isLast,
}) => {
  const intl = useIntl();
  const { mutate } = useMutation();

  const ids = useLocationHashNodeIds();

  const idsWithId = pipe(ids, readonlyArray.append(id));
  // Preload for with button to suppress UI flickering.
  useQueryNodesByIds(idsWithId);
  useQueryNodesByContextNodesSortedByCreatedAtDesc(idsWithId);

  const router = useRouter();

  const handleWithPress = () => {
    pipe(idsWithId, nodeIdsToLocationHash, (hash) => {
      router.push(`/#${hash}`);
    });
  };

  const { move } = useContext(KeyboardNavigationContext);

  const onDeleteOrRemoveOnComplete = () => {
    if (isLast) focusId("allLink")();
    else move("current");
  };

  const handleDeletePress = () => {
    mutate("node", { id, isDeleted: true }, onDeleteOrRemoveOnComplete);
  };

  // Preloading for remove button.
  const edgesToDelete = useQuery((db) => {
    const [a, b] = pipe(
      ids,
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
    if (!edgesToDelete.isLoaded) return;
    edgesToDelete.rows.forEach(({ id }) => {
      mutate("edge", { id, isDeleted: true }, onDeleteOrRemoveOnComplete);
    });
  };

  const hasContextNodes = ids.length > 0;

  return (
    <Popover
      ownerRef={ownerRef}
      position="top left to top right"
      onRequestClose={onRequestClose}
    >
      <View className="flex-row">
        <KeyboardNavigationProvider maxX={hasContextNodes ? 2 : 0}>
          <PopoverButton
            title={intl.formatMessage({
              defaultMessage: "Delete",
              id: "K3r6DQ",
            })}
            x={0}
            onPress={handleDeletePress}
            className={clsx(hasContextNodes && "rounded-r-none")}
          />
          {hasContextNodes && (
            <>
              <PopoverButton
                title={intl.formatMessage({
                  defaultMessage: "With",
                  id: "E8dH1q",
                })}
                x={1}
                onPress={handleWithPress}
                className={hasContextNodes ? "rounded-none" : "rounded-l-none"}
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
