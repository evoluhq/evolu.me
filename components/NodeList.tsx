import { NodeId } from "evolu";
import { memo, useCallback, useLayoutEffect, useRef } from "react";
import useEvent from "react-use-event-hook";
import { NodeMarkdown } from "../lib/db";
import { focusId, focusIds } from "../lib/focusIds";
import {
  FocusPosition,
  KeyboardNavigationProvider,
  KeyboardNavigationProviderRef,
} from "../lib/hooks/useKeyNavigation";
import { useRequestFocus } from "../lib/hooks/useRequestFocus";
import { useScrollRestoration } from "../lib/hooks/useScrollRestoration";
import { About } from "./About";
import { NodeItem } from "./NodeItem";
import { View } from "./styled";

interface NodeListProps {
  ids: readonly NodeId[];
  rows: readonly { id: NodeId; md: NodeMarkdown }[];
}

export const NodeList = memo<NodeListProps>(function NodeList({ ids, rows }) {
  const focusPositionsRef = useRef<Map<string, FocusPosition>>();

  const getFocusPositions = () => {
    if (!focusPositionsRef.current) focusPositionsRef.current = new Map();
    return focusPositionsRef.current;
  };

  const idsString = ids.join();

  const handleKeyboardNavigationFocus = useEvent((position: FocusPosition) => {
    getFocusPositions().set(idsString, position);
  });

  const prevIdsRef = useRef<string>();

  const keyboardNavigationProviderRef =
    useRef<KeyboardNavigationProviderRef>(null);

  const { restoreScroll, storeScroll } = useScrollRestoration();

  const requestFocus = useRequestFocus();

  useLayoutEffect(() => {
    if (prevIdsRef.current === idsString) return;
    prevIdsRef.current = idsString;

    if (rows.length === 0) {
      requestFocus(focusId("allLink"));
    } else {
      const position = restoreScroll(idsString);
      requestFocus(() => {
        keyboardNavigationProviderRef.current?.move(
          position || { x: 0, y: 1 },
          { smoothScroll: false }
        );
      });
    }

    return () => {
      const position = getFocusPositions().get(idsString);
      // y: 1 ensures "With" will save position of a link, not a button
      storeScroll(idsString, position && { x: position.x, y: 1 });
    };
  });

  const handleKeyboardNavigationOnKey = useCallback(
    (key: string) => {
      if (key === "Enter" || key === "Escape") requestFocus();
    },
    [requestFocus]
  );

  if (!rows.length && !ids.length) return <About />;

  return (
    <View
      accessibilityRole="list"
      // I'm still not sure whatever it's good idea or not.
      // className="py-[88px]" // A space for scrolling, 2x44
    >
      <KeyboardNavigationProvider
        maxX={rows.length - 1}
        maxY={1}
        initialY={1}
        onFocus={handleKeyboardNavigationFocus}
        ref={keyboardNavigationProviderRef}
        onKey={handleKeyboardNavigationOnKey}
        smoothScrollDomId={focusIds.layoutScrollView}
      >
        {({ x, y }) =>
          rows.map((row, i) => (
            <NodeItem
              key={row.id}
              row={row}
              x={i}
              focusable={i === x && (y === 0 ? "button" : "input")}
              isLast={rows.length === 1}
            />
          ))
        }
      </KeyboardNavigationProvider>
    </View>
  );
});
