import { IO } from "fp-ts/IO";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";
import { Modal as RnModal } from "react-native";
import { Pressable } from "./styled";

export type ModalProps = {
  children: ReactNode;
  visible: boolean;
  onRequestClose: IO<void>;
};

export const Modal: FC<ModalProps> = ({
  visible,
  children,
  onRequestClose,
}) => {
  const intl = useIntl();

  return (
    <RnModal transparent onRequestClose={onRequestClose} visible={visible}>
      {children}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={intl.formatMessage({
          defaultMessage: "Close",
          id: "rbrahO",
        })}
        className="absolute inset-0 -z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
        onPress={onRequestClose}
      />
    </RnModal>
  );
};
