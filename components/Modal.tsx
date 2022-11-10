import { IO } from "fp-ts/IO";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";
import { Modal as RnModal } from "react-native";
import { Container } from "./Container";
import { Ring } from "./Ring";
import { Pressable, View } from "./styled";

export type ModalProps = {
  visible?: boolean;
  onRequestClose: IO<void>;
  children: ReactNode;
  centerContent?: boolean;
};

export const Modal: FC<ModalProps> = ({
  visible = true,
  onRequestClose,
  children,
  centerContent,
}) => {
  const intl = useIntl();

  if (centerContent)
    children = (
      <>
        <View className="absolute inset-0 bg-white opacity-80 dark:bg-black" />
        <View className="flex-1 items-center justify-center px-2">
          <Ring>{children}</Ring>
        </View>
      </>
    );

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
