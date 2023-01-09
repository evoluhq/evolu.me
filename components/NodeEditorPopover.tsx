import clsx from "clsx";
import { readonlyArray } from "fp-ts";
import { pipe } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import { useRouter } from "next/router";
import { FC, MutableRefObject } from "react";
import { useIntl } from "react-intl";
import { alertTodo } from "../lib/alertTodo";
import { NodeId } from "../lib/db";
import {
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
      <Text as="button" className={clsx("my-0 py-1", className)}>
        {title}
      </Text>
    </Button>
  );
};

export const NodeEditorPopover: FC<{
  id: NodeId;
  onRequestClose: IO<void>;
  ownerRef: MutableRefObject<View | null>;
}> = ({ id, onRequestClose, ownerRef }) => {
  const intl = useIntl();

  const locationNodeIds = useLocationHashNodeIds();

  const router = useRouter();

  const handleRemoveFromContextPress = () => {
    pipe(
      locationNodeIds,
      readonlyArray.filter((a) => a !== id),
      nodeIdsToLocationHash,
      (hash) => {
        router.push(hash ? `/#${hash}` : "/");
      }
    );
  };

  return (
    <Popover
      ownerRef={ownerRef}
      position="center right to center left"
      onRequestClose={onRequestClose}
    >
      <View className="flex-row">
        <KeyboardNavigationProvider maxX={2}>
          <PopoverButton
            title={intl.formatMessage({
              defaultMessage: "Delete",
              id: "K3r6DQ",
            })}
            x={0}
            onPress={alertTodo}
            className="rounded-r-none"
          />
          <PopoverButton
            title={intl.formatMessage({
              defaultMessage: "Without",
              id: "xRkUEP",
            })}
            x={1}
            onPress={handleRemoveFromContextPress}
            className="rounded-none"
          />
          <PopoverButton
            title={intl.formatMessage({
              defaultMessage: "History",
              id: "djJp6c",
            })}
            x={2}
            onPress={alertTodo}
            className="rounded-l-none"
          />
        </KeyboardNavigationProvider>
      </View>
    </Popover>
  );
};
