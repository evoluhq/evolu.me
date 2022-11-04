import { Modal } from "react-native";
import { View } from "./styled";
import { TextButton } from "./TextButton";

export const MainNav = () => {
  return (
    <View className="p-[2px]">
      <TextButton title="⋮" />
      <Modal
        transparent
        onRequestClose={() => {
          //
        }}
        visible={false}
      >
        <View>
          {/* <Text>Hello, World!</Text> */}
          {/* <Button onPress={() => setIsVisible(false)} title={"Close"} /> */}
        </View>
      </Modal>
    </View>
  );
};
