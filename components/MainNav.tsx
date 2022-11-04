import { useState } from "react";
import { Modal } from "./Modal";
import { View } from "./styled";
import { TextButton } from "./TextButton";

export const MainNav = () => {
  const [modalIsVisible, setModalIsVisible] = useState(false);

  return (
    <>
      <TextButton
        title="⋮"
        onPress={() => {
          setModalIsVisible(true);
        }}
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
