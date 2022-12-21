import clsx from "clsx";
import { useRouter } from "next/router";
import { FC, ReactNode, useRef, useState } from "react";
import { useIntl } from "react-intl";
import useEvent from "react-use-event-hook";
import { Text } from "../components/Text";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { Button } from "./Button";
import { Link } from "./Link";
import { Popover } from "./Popover";
import { View } from "./styled";

const MainNavLink: FC<{
  children: ReactNode;
  href: string;
  x: number;
  className: string;
}> = ({ children, href, x, className }) => {
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
        className={clsx("px-3", className)}
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
      <MainNavLink href="/" x={0} className="rounded-b-none">
        {intl.formatMessage({ defaultMessage: "Home", id: "ejEGdx" })}
      </MainNavLink>
      <MainNavLink href="/settings" x={1} className="rounded-none">
        {intl.formatMessage({ defaultMessage: "Settings", id: "D3idYv" })}
      </MainNavLink>
      <MainNavLink href="/help" x={2} className="rounded-none">
        {intl.formatMessage({ defaultMessage: "Help", id: "SENRqu" })}
      </MainNavLink>
      <MainNavLink href="/about" x={3} className="rounded-t-none">
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
      // ArrowLeft: { id: uniqueId.lastNodeFilterItem },
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
