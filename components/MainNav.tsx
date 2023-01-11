import clsx from "clsx";
import { useRouter } from "next/router";
import { FC, ReactNode, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { Text } from "../components/Text";
import { Button } from "./Button";
import { Link } from "./Link";
import { Popover } from "./Popover";
import { View } from "./styled";

const MainNavLink: FC<{
  children: ReactNode;
  href: string;
  className: string;
}> = ({ children, href, className }) => {
  const isCurrent = href === useRouter().pathname;

  return (
    <Link href={href}>
      <Text
        as="link"
        p
        transparent={!isCurrent}
        className={clsx("px-3", className)}
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
      <MainNavLink href="/" className="rounded-b-none">
        {intl.formatMessage({ defaultMessage: "Home", id: "ejEGdx" })}
      </MainNavLink>
      <MainNavLink href="/settings" className="rounded-none">
        {intl.formatMessage({ defaultMessage: "Settings", id: "D3idYv" })}
      </MainNavLink>
      <MainNavLink href="/help" className="rounded-none">
        {intl.formatMessage({ defaultMessage: "Help", id: "SENRqu" })}
      </MainNavLink>
      <MainNavLink href="/about" className="rounded-t-none">
        {intl.formatMessage({ defaultMessage: "About", id: "g5pX+a" })}
      </MainNavLink>
    </>
  );
};

export const MainNav = () => {
  const intl = useIntl();
  const [popoverIsVisible, setPopoverIsVisible] = useState(false);
  const buttonRef = useRef<View | null>(null);

  return (
    <>
      <Button
        onPress={() => setPopoverIsVisible(true)}
        ref={buttonRef}
        className="w-9"
      >
        <Text as="button">
          {intl.formatMessage({ defaultMessage: "≡", id: "zpCxcz" })}
        </Text>
      </Button>
      {popoverIsVisible ? (
        <Popover
          ownerRef={buttonRef}
          position="top right to top right"
          onRequestClose={() => setPopoverIsVisible(false)}
        >
          <MainNavLinks />
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
