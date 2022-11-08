import { FC, ReactNode, useState } from "react";
import { View as RnView } from "react-native";
import { uniqueId } from "../lib/uniqueId";
import { useKeyNavigation } from "../lib/useKeyNavigation";
import { Modal } from "./Modal";
import { View } from "./styled";
import { TextButton } from "./TextButton";
import { TextLink } from "./TextLink";

const Shadow: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <View className="rounded bg-white px-2 ring-1 ring-gray-300 dark:bg-black dark:ring-gray-800">
      {children}
    </View>
  );
};

const MainNavLinks = () => {
  return (
    <View className="absolute bottom-3 right-3">
      <Shadow>
        <TextLink href="/" text="Home" />
        <TextLink href="/settings" text="Settings" />
        <TextLink href="/about" text="About" />
      </Shadow>
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
