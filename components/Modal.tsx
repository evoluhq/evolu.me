import { IO } from "fp-ts/IO";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";
import { Modal as RnModal } from "react-native";
import { Container } from "./Container";
import { Pressable } from "./styled";

export type ModalProps = {
  visible?: boolean;
  onRequestClose: IO<void>;
  children: ReactNode;
};

export const Modal: FC<ModalProps> = ({
  visible = true,
  onRequestClose,
  children,
}) => {
  const intl = useIntl();

  return (
    <RnModal transparent onRequestClose={onRequestClose} visible={visible}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={intl.formatMessage({
          defaultMessage: "Close",
          id: "rbrahO",
        })}
        className="absolute inset-0 cursor-default focus:outline-none"
        onPress={onRequestClose}
      >
        <Container flex1>{children}</Container>
      </Pressable>
    </RnModal>
  );
};
