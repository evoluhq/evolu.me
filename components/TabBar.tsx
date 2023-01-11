import { IO } from "fp-ts/IO";
import { useRouter } from "next/router";
import { FC, memo, useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { useIntl } from "react-intl";
import { alertTodo } from "../lib/alertTodo";
import { NodeId, NodeMarkdown } from "../lib/db";
import { focusId, focusIds } from "../lib/focusIds";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useRequestFocus } from "../lib/hooks/useRequestFocus";
import { AddNodeModal } from "./AddNodeModal";
import { Button } from "./Button";
import { Link } from "./Link";
import { View } from "./styled";
import { Text } from "./Text";

const TabBarButton: FC<{
  hrefOrOnPress: string | IO<void>;
  title: string;
  focusable: boolean;
  x: number;
  id?: string;
}> = ({ hrefOrOnPress, title, focusable, x, id }) => {
  const router = useRouter();
  const requestFocus = useRequestFocus();

  const keyNavigation = useKeyNavigation({
    x,
    keys: {
      ArrowLeft: "previousX",
      ArrowRight: "nextX",
      Enter: () => {
        requestFocus();
      },
      Escape: () => {
        requestFocus();
        router.back();
      },
    },
  });

  if (typeof hrefOrOnPress === "function")
    return (
      <Button
        className="flex-1"
        onPress={hrefOrOnPress}
        focusable={focusable}
        {...keyNavigation}
        nativeID={id}
      >
        <Text as="button">{title}</Text>
      </Button>
    );
  return (
    <Link href={hrefOrOnPress}>
      <Text
        as="link"
        p
        className="my-1 flex-1 px-0 py-1 text-center"
        // @ts-expect-error RNfW
        focusable={focusable}
        {...keyNavigation}
        nativeID={id}
      >
        {title}
      </Text>
    </Link>
  );
};

export const TabBar = memo<{
  ids: readonly NodeId[];
  rows: readonly { id: NodeId; md: NodeMarkdown }[];
}>(function TabBar({ ids, rows }) {
  const intl = useIntl();
  const [modal, setModal] = useState<"add" | "search" | null>(null);

  const handleRequestClose = useCallback(() => {
    setModal(null);
  }, []);

  const renderModal = (): JSX.Element | null => {
    switch (modal) {
      case "add":
        return (
          <AddNodeModal
            ids={ids}
            rows={rows}
            onRequestClose={handleRequestClose}
          />
        );
      case "search":
        return null;
      case null:
        return null;
    }
  };

  const handleAddPress = () => {
    // In iOS Safari, the focus shows virtual keyboard only in a click handler.
    flushSync(() => {
      setModal("add");
    });
    focusId("editorContentEditable")();
  };

  return (
    <View className="flex-row">
      {renderModal()}
      <KeyboardNavigationProvider maxX={2}>
        {({ x }) => (
          <>
            <TabBarButton
              hrefOrOnPress={"/"}
              title={intl.formatMessage({
                defaultMessage: "All",
                id: "zQvVDJ",
              })}
              focusable={x === 0}
              x={0}
              id={focusIds.allLink}
            />
            <TabBarButton
              hrefOrOnPress={handleAddPress}
              title={intl.formatMessage({
                defaultMessage: "Add",
                id: "2/2yg+",
              })}
              focusable={x === 1}
              x={1}
            />
            <TabBarButton
              hrefOrOnPress={alertTodo}
              title={intl.formatMessage({
                defaultMessage: "Search",
                id: "xmcVZ0",
              })}
              focusable={x === 2}
              x={2}
            />
          </>
        )}
      </KeyboardNavigationProvider>
    </View>
  );
});
