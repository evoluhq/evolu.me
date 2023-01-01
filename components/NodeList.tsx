import { has, model, NodeId } from "evolu";
import { useAtomValue } from "jotai";
import { FC, useLayoutEffect, useMemo, useRef } from "react";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import Balancer from "react-wrap-balancer";
import { editNodeIdAtom } from "../lib/atoms";
import { useQuery } from "../lib/db";
import { focusClassName } from "../lib/focusClassNames";
import { useAppDescription } from "../lib/hooks/useAppDescription";
import {
  FocusPosition,
  KeyboardNavigationProvider,
  KeyboardNavigationProviderRef,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { useScrollRestoration } from "../lib/hooks/useScrollRestoration";
import { NodeItem } from "./NodeItem";
import { View } from "./styled";
import { Text } from "./Text";

let canDoAutoFocusOnInput = false;

// It's impossible to detect a virtual keyboard, so we can't autoFocus input
// naively. No touch detection is possible, and we can autoFocus only when
// we are 100% sure a user used key navigation.
const handleNodeItemKeyEnter = () => {
  canDoAutoFocusOnInput = true;
};

const NodeListPlaceholder: FC<{ ids: readonly NodeId[] }> = ({ ids }) => {
  const intl = useIntl();
  const description = useAppDescription();

  const getMessage = (): string => {
    switch (ids.length) {
      case 0:
        return description;
      case 1:
        return intl.formatMessage({
          defaultMessage: `No connections.`,
          id: "o4TjqS",
        });
      default:
        return intl.formatMessage({
          defaultMessage: `You have more than one item in the filter, and that's how you can filter or connect as many thoughts as necessary.

The possibilities are endless.`,
          id: "Sbf3N/",
        });
    }
  };

  return (
    <Text className="text-center">
      <Balancer>{getMessage()}</Balancer>
    </Text>
  );
};

export const NodeList = () => {
  const ids = useLocationHashNodeIds();

  const { rows, isLoaded } = useQuery((db) => {
    // https://inviqa.com/blog/storing-graphs-database-sql-meets-social-network
    let q = db
      .selectFrom("node")
      .select(["id", "title"])
      .orderBy("createdAt", "desc")
      .where("isDeleted", "is not", model.cast(true));

    ids.forEach((adjacentId) => {
      q = q.where("id", "in", (qb) =>
        qb
          .selectFrom("edge")
          .where("isDeleted", "is not", model.cast(true))
          .where("b", "=", adjacentId)
          .select("a as id")
          .union(
            qb
              .selectFrom("edge")
              .where("isDeleted", "is not", model.cast(true))
              .where("a", "=", adjacentId)
              .select("b as id")
          )
      );
    });

    return q;
  });

  const loadedRows = useMemo(() => rows.filter(has(["title"])), [rows]);

  const { scrollToEndAnimatedIfRequested } = useScrollRestoration();
  useLayoutEffect(() => scrollToEndAnimatedIfRequested());

  const idsString = ids.join();

  const focusPositionRef = useRef<Map<string, FocusPosition>>();
  const getFocusPosition = () => {
    if (!focusPositionRef.current) focusPositionRef.current = new Map();
    return focusPositionRef.current;
  };

  const handleKeyboardNavigationProviderFocus = useEvent(
    (position: FocusPosition) => {
      getFocusPosition().set(idsString, position);
    }
  );

  const keyboardNavigationProviderRef =
    useRef<KeyboardNavigationProviderRef>(null);

  const { restoreScroll, storeScroll } = useScrollRestoration();

  // We use useEvent to not rerun useLayoutEffect on loadedRows.length change.
  const isEmpty = useEvent(() => loadedRows.length === 0);
  useLayoutEffect(() => {
    if (!isLoaded) return;
    if (isEmpty()) {
      if (canDoAutoFocusOnInput) {
        focusClassName("createNodeInput")();
      }
    } else {
      // AutoFocus on links is OK.
      const position = restoreScroll(idsString);
      // We have a position, we know it's not the initial render.
      if (position) keyboardNavigationProviderRef.current?.move(position);
      // We check it's not the initial render because something was focused.
      else if (getFocusPosition().size > 0) {
        keyboardNavigationProviderRef.current?.move({ x: 0, y: 1 });
      }
    }

    return () => {
      const position = getFocusPosition().get(idsString);
      // y: 1 ensures "Add To Filter" will save focus to the link, not the button.
      storeScroll(idsString, position ? { x: position.x, y: 1 } : undefined);
    };
  }, [idsString, isEmpty, isLoaded, restoreScroll, storeScroll]);

  const editNodeId = useAtomValue(editNodeIdAtom);

  if (!isLoaded) return null;

  if (loadedRows.length === 0) return <NodeListPlaceholder ids={ids} />;

  return (
    <View
      accessibilityRole="list"
      // className="py-[88px]" // A space for scrolling, 2x44
    >
      <KeyboardNavigationProvider
        maxX={loadedRows.length - 1}
        maxY={1}
        initialY={1}
        onFocus={handleKeyboardNavigationProviderFocus}
        ref={keyboardNavigationProviderRef}
      >
        {({ x, y }) =>
          loadedRows.map((row, i) => (
            <NodeItem
              key={row.id}
              row={row}
              x={i}
              focusable={i === x && (y === 0 ? "button" : "input")}
              isFirst={i === 0}
              isLast={i === rows.length - 1}
              onKeyEnter={handleNodeItemKeyEnter}
              isEdit={row.id === editNodeId}
            />
          ))
        }
      </KeyboardNavigationProvider>
    </View>
  );
};
