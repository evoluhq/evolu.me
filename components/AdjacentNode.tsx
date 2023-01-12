import { useRouter } from "next/router";
import { memo } from "react";
import { NodeId, NodeMarkdown } from "../lib/db";
import { getFirstLineAlwaysVisible } from "../lib/getFirstLineAlwaysVisible";
import { useKeyNavigation } from "../lib/hooks/useKeyNavigation";
import { AdjacentNodeButton } from "./AdjacentNodeButton";
import { Link } from "./Link";
import { View } from "./styled";
import { Text } from "./Text";

interface AdjacentNodeProps {
  row: {
    id: NodeId;
    md: NodeMarkdown;
  };
  focusable: false | "button" | "input";
  x: number;
  isLast: boolean;
}

export const AdjacentNode = memo<AdjacentNodeProps>(function AdjacentNode({
  row: { id, md },
  focusable,
  x,
  isLast,
}) {
  const router = useRouter();

  const linkKeyNavigation = useKeyNavigation({
    x,
    y: 1,
    keys: {
      ArrowUp: "previousX",
      ArrowDown: "nextX",
      ArrowLeft: "previousY",
      Escape: () => router.back(),
    },
  });

  return (
    <View className="-ml-3 flex-row" accessibilityRole={"listitem" as "list"}>
      <AdjacentNodeButton
        focusable={focusable === "button"}
        id={id}
        x={x}
        isLast={isLast}
      />
      <Link href={`/#${id}`} scroll={false}>
        <Text
          {...linkKeyNavigation}
          as="link"
          p
          className="-ml-1 px-1"
          // @ts-expect-error RNfW
          focusable={focusable === "input"}
          numberOfLines={1}
          nativeID={id}
        >
          {getFirstLineAlwaysVisible(md)}
        </Text>
      </Link>
    </View>
  );
});
