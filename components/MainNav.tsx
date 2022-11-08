import { useState } from "react";
import { View as RnView } from "react-native";
import { uniqueId } from "../lib/uniqueId";
import { useKeyNavigation } from "../lib/useKeyNavigation";
import { Modal } from "./Modal";
import { Ring } from "./Ring";
import { View } from "./styled";
import { TextButton } from "./TextButton";
import { TextLink } from "./TextLink";

const MainNavLinks = () => {
  return (
    <View className="absolute bottom-3 right-3">
      <Ring>
        <TextLink href="/" text="Home" />
        <TextLink href="/settings" text="Settings" />
        <TextLink href="/about" text="About" />
      </Ring>
    </View>
  );
};

export const MainNav = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false);

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
        onPress={() => setModalIsVisible(true)}
        {...buttonKeyNavigation}
        nativeID={uniqueId.mainNavButton}
      />

      {modalIsVisible ? (
        <Modal visible={true} onRequestClose={() => setModalIsVisible(false)}>
          <MainNavLinks />
        </Modal>
      ) : (
        // SEO
        <View className="hidden">
          <MainNavLinks />
        </View>
      )}
    </>
  );
};
