import { useRouter } from "next/router";
import { FC, ReactNode, useState } from "react";
import { useIntl } from "react-intl";
import { Text, View as RnView } from "react-native";
import { uniqueId } from "../lib/uniqueId";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { Button } from "./Button";
import { Link } from "./Link";
import { Popover } from "./Popover";
import { View } from "./styled";
import { T } from "./T";

const MainNavLink: FC<{
  children: ReactNode;
  href: string;
  x: number;
}> = ({ children, href, x }) => {
  const keyNavigation = useKeyNavigation<Text>({
    x,
    keys: { ArrowUp: "previousX", ArrowDown: "nextX" },
  });
  const isCurrent = href === useRouter().pathname;

  return (
    <Link href={href}>
      <T
        v={"a"}
        customClassName={!isCurrent && "opacity-60"}
        {...keyNavigation}
      >
        {children}
      </T>
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

  const buttonKeyNavigation = useKeyNavigation<RnView>({
    keys: {
      ArrowLeft: { id: uniqueId.lastEvoluNavItem },
      ArrowUp: { id: uniqueId.createEvoluInput },
    },
  });

  return (
    <>
      <Button
        onPress={() => setPopoverIsVisible(true)}
        {...buttonKeyNavigation}
        nativeID={uniqueId.mainNavButton}
      >
        <T v="tb">
          {intl.formatMessage({ defaultMessage: "⋮", id: "Z/OE6b" })}
        </T>
      </Button>
      {popoverIsVisible ? (
        <Popover
          ownerRef={buttonKeyNavigation.ref}
          position="bottom right to left"
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
