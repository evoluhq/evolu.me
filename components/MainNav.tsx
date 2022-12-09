import { useRouter } from "next/router";
import { FC, ReactNode, useRef, useState } from "react";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import { Text } from "../components/Text";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { uniqueId } from "../lib/uniqueId";
import { Button } from "./Button";
import { Link } from "./Link";
import { Popover } from "./Popover";
import { View } from "./styled";

const MainNavLink: FC<{
  children: ReactNode;
  href: string;
  x: number;
}> = ({ children, href, x }) => {
  const keyNavigation = useKeyNavigation({
    x,
    keys: { ArrowUp: "previousX", ArrowDown: "nextX" },
  });
  const isCurrent = href === useRouter().pathname;

  return (
    <Link href={href}>
      <Text
        as="link"
        p
        transparent={!isCurrent}
        className="px-3"
        {...keyNavigation}
      >
        {children}
      </Text>
    </Link>
  );
};

const MainNavLinks = () => {
  const intl = useIntl();

  return (
    <>
      <MainNavLink href="/" x={0}>
        {intl.formatMessage({ defaultMessage: "Home", id: "ejEGdx" })}
      </MainNavLink>
      <MainNavLink href="/settings" x={1}>
        {intl.formatMessage({ defaultMessage: "Settings", id: "D3idYv" })}
      </MainNavLink>
      <MainNavLink href="/help" x={2}>
        {intl.formatMessage({ defaultMessage: "Help", id: "SENRqu" })}
      </MainNavLink>
      <MainNavLink href="/about" x={3}>
        {intl.formatMessage({ defaultMessage: "About", id: "g5pX+a" })}
      </MainNavLink>
    </>
  );
};

export const MainNav = () => {
  const intl = useIntl();
  const [popoverIsVisible, setPopoverIsVisible] = useState(false);

  const buttonKeyNavigation = useKeyNavigation({
    keys: {
      // ArrowLeft: { id: uniqueId.lastAdjacentNodesItem },
      // ArrowUp: { id: uniqueId.createNodeInput },
    },
  });

  const buttonRef = useRef<View | null>(null);
  const handleRef = useEvent((view: View | null) => {
    buttonKeyNavigation.ref(view);
    buttonRef.current = view;
  });

  return (
    <>
      <Button
        onPress={() => setPopoverIsVisible(true)}
        {...buttonKeyNavigation}
        ref={handleRef}
        nativeID={uniqueId.mainNavButton}
      >
        <Text as="button">
          {intl.formatMessage({ defaultMessage: "⋮", id: "Z/OE6b" })}
        </Text>
      </Button>
      {popoverIsVisible ? (
        <Popover
          ownerRef={buttonRef}
          position="top right to top right"
          onRequestClose={() => setPopoverIsVisible(false)}
        >
          <KeyboardNavigationProvider maxX={3}>
            <MainNavLinks />
          </KeyboardNavigationProvider>
        </Popover>
      ) : (
        // SEO
        <View className="hidden">
          <MainNavLinks />
        </View>
      )}
    </>
  );
};
