import { useState } from "react";
import { uniqueId } from "../lib/uniqueId";
import { useKeyNavigation } from "../lib/useKeyNavigation";
import { Modal } from "./Modal";
import { View } from "./styled";
import { View as RnView } from "react-native";
import { TextButton } from "./TextButton";

export const MainNav = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const keyNavigation = useKeyNavigation<RnView>({
    keys: {
      ArrowLeft: { id: uniqueId.lastFilterButton },
      ArrowUp: { id: uniqueId.createEvoluInput },
    },
  });

  return (
    <>
      <TextButton
        title="⋮"
        onPress={() => {
          setModalIsVisible(true);
        }}
        {...keyNavigation}
        nativeID={uniqueId.mainNavButton}
      />
      <Modal
        visible={modalIsVisible}
        onRequestClose={() => {
          setModalIsVisible(false);
        }}
      >
        <View>
          <TextButton title="Ahoj" />
        </View>
      </Modal>
    </>
  );
};
