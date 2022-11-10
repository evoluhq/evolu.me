import { IO } from "fp-ts/IO";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";
import { Modal } from "react-native";
import { Container } from "./Container";
import { Ring } from "./Ring";
import { View, Pressable } from "./styled";

export type PopoverProps = {
  onRequestClose: IO<void>;
  children: ReactNode;
  position: "bottom right"; // consider ref
};

export const Popover: FC<PopoverProps> = ({ onRequestClose, children }) => {
  const intl = useIntl();

  return (
    <Modal transparent onRequestClose={onRequestClose} visible>
      <Container flex1>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={intl.formatMessage({
            defaultMessage: "Close",
            id: "rbrahO",
          })}
          className="absolute inset-0 focus:outline-none"
          onPress={onRequestClose}
        />
        <View className="absolute right-3 bottom-3">
          <Ring>{children}</Ring>
        </View>
      </Container>
    </Modal>
  );
};
