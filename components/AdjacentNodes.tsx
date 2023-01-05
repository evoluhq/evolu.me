import { NodeId, NonEmptyString1000 } from "evolu";
import { FC, memo, useLayoutEffect, useRef } from "react";
import useEvent from "react-use-event-hook";
import Balancer from "react-wrap-balancer";
import { focusClassName } from "../lib/focusClassNames";
import { useAppDescription } from "../lib/hooks/useAppDescription";
import {
  FocusPosition,
  KeyboardNavigationProvider,
  KeyboardNavigationProviderRef,
} from "../lib/hooks/useKeyNavigation";
import { useScrollRestoration } from "../lib/hooks/useScrollRestoration";
import { AdjacentNode } from "./AdjacentNode";
import { View } from "./styled";
import { Text } from "./Text";

let canDoAutoFocusOnInput = false;

// It's impossible to detect a virtual keyboard, so we can't autoFocus input
// naively. No touch detection is possible, and we can autoFocus only when
// we are 100% sure a user used key navigation.
const handleAdjacentNodeKeyEnter = () => {
  canDoAutoFocusOnInput = true;
};

const AboutForEmptyContent: FC = () => {
  const description = useAppDescription();

  return (
    <Text className="text-center">
      <Balancer>{description}</Balancer>
    </Text>
  );
};

export const AdjacentNodes = memo<{
  ids: readonly NodeId[];
  rows: readonly { id: NodeId; title: NonEmptyString1000 }[];
}>(function AdjacentNodes({ ids, rows }) {
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
  const isEmpty = useEvent(() => rows.length === 0);
  useLayoutEffect(() => {
    if (isEmpty()) {
      if (canDoAutoFocusOnInput) {
        focusClassName("editorContentEditable")();
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
  }, [idsString, isEmpty, restoreScroll, storeScroll]);

  if (!rows.length && !ids.length) return <AboutForEmptyContent />;

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
              isFirst={i === 0}
              isLast={i === rows.length - 1}
              onKeyEnter={handleAdjacentNodeKeyEnter}
            />
          ))
        }
      </KeyboardNavigationProvider>
    </View>
  );
});
