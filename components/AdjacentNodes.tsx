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
import { useScrollRestoration } from "../lib/hooks/useScrollRestoration";
import { About } from "./About";
import { AdjacentNode } from "./AdjacentNode";
import { View } from "./styled";

export const AdjacentNodes = memo<{
  ids: readonly NodeId[];
  rows: readonly { id: NodeId; md: NodeMarkdown }[];
  initialRender: boolean;
}>(function AdjacentNodes({ ids, rows, initialRender }) {
  const focusPositionsRef = useRef<Map<string, FocusPosition>>();

  const getFocusPositions = () => {
    if (!focusPositionsRef.current) focusPositionsRef.current = new Map();
    return focusPositionsRef.current;
  };

  const idsString = ids.join();

  const handleKeyboardNavigationProviderFocus = useEvent(
    (position: FocusPosition) => {
      getFocusPositions().set(idsString, position);
    }
  );

  const keyboardNavigationProviderRef =
    useRef<KeyboardNavigationProviderRef>(null);

  const { restoreScroll, storeScroll } = useScrollRestoration();

  const prevIdsRef = useRef<string>();

  useLayoutEffect(() => {
    if (prevIdsRef.current === idsString) return;
    prevIdsRef.current = idsString;

    if (rows.length === 0) {
      focusId("allLink")();
    } else {
      const position = restoreScroll(idsString);
      if (position) keyboardNavigationProviderRef.current?.move(position);
      else if (!initialRender)
        keyboardNavigationProviderRef.current?.move({ x: 0, y: 1 });
    }

    return () => {
      const position = getFocusPositions().get(idsString);
      // y: 1 ensures "With" will save position of a link, not a button
      storeScroll(idsString, position && { x: position.x, y: 1 });
    };
  });

  const handleOnKeyUpDown = useCallback(() => {
    // Element focus doesn't have smooth scroll option.
    // https://github.com/WICG/proposals/issues/41
    const el = document.getElementById(focusIds.layoutScrollView);
    if (!el) return;
    el.classList.add("scroll-smooth");
    setTimeout(() => {
      el.classList.remove("scroll-smooth");
    });
  }, []);

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
        onFocus={handleKeyboardNavigationProviderFocus}
        ref={keyboardNavigationProviderRef}
      >
        {({ x, y }) =>
          rows.map((row, i) => (
            <AdjacentNode
              key={row.id}
              row={row}
              x={i}
              focusable={i === x && (y === 0 ? "button" : "input")}
              onKeyUpDown={handleOnKeyUpDown}
            />
          ))
        }
      </KeyboardNavigationProvider>
    </View>
  );
});
