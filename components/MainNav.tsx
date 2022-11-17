import { useState } from "react";
import { useIntl } from "react-intl";
import { View as RnView } from "react-native";
import { uniqueId } from "../lib/uniqueId";
import { useKeyNavigation } from "../lib/useKeyNavigation";
import { Button } from "./Button";
import { Link } from "./Link";
import { Popover } from "./Popover";
import { View } from "./styled";
import { T } from "./T";

const MainNavLinks = () => {
  const intl = useIntl();

  return (
    <>
      <Link href="/">
        <T v="a">
          {intl.formatMessage({ defaultMessage: "Home", id: "ejEGdx" })}
        </T>
      </Link>
      <Link href="/settings">
        <T v="a">
          {intl.formatMessage({ defaultMessage: "Settings", id: "D3idYv" })}
        </T>
      </Link>
      <Link href="/about">
        <T v="a">
          {intl.formatMessage({ defaultMessage: "About", id: "g5pX+a" })}
        </T>
      </Link>
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
