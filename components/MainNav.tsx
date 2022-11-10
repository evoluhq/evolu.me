import { useState } from "react";
import { View as RnView } from "react-native";
import { uniqueId } from "../lib/uniqueId";
import { useKeyNavigation } from "../lib/useKeyNavigation";
import { Popover } from "./Popover";
import { View } from "./styled";
import { TextButton } from "./TextButton";
import { TextLink } from "./TextLink";

const MainNavLinks = () => {
  return (
    <View>
      <TextLink href="/" text="Home" />
      <TextLink href="/settings" text="Settings" />
      <TextLink href="/about" text="About" />
    </View>
  );
};

export const MainNav = () => {
  const [popoverIsVisible, setPopoverIsVisible] = useState(false);

  const buttonKeyNavigation = useKeyNavigation<RnView>({
    keys: {
      ArrowLeft: { id: uniqueId.lastFilterButton },
      ArrowUp: { id: uniqueId.createEvoluInput },
    },
  });

  return (
    <>
      <TextButton
        title="⋮"
        variant="text"
        onPress={() => setPopoverIsVisible(true)}
        {...buttonKeyNavigation}
        nativeID={uniqueId.mainNavButton}
      />
      {popoverIsVisible ? (
        <Popover
          position="bottom right"
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
