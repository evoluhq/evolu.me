import { IO } from "fp-ts/IO";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";
import { Modal } from "react-native";
import { CloseButtonLayer } from "./CloseButtonLayer";
import { Container } from "./Container";
import { Heading } from "./Heading";
import { Ring } from "./Ring";
import { Pressable, ScrollView, View } from "./styled";
import { TextButton } from "./TextButton";

export type DialogProps = {
  title: string;
  onRequestClose: IO<void>;
  children: ReactNode;
  buttons?: ReactNode;
};

export const Dialog: FC<DialogProps> = ({
  title,
  onRequestClose,
  children,
  buttons,
}) => {
  const intl = useIntl();
  const closeMessage = intl.formatMessage({
    defaultMessage: "Close dialog",
    id: "UaOI5P",
  });

  return (
    <Modal transparent onRequestClose={onRequestClose} visible>
      <ScrollView centerContent>
        <Container>
          <View className="py-4 px-1">
            <Ring>
              <View className="p-3">
                <Heading level={1}>{title}</Heading>
                {children}
                <View className="flex-row gap-2">
                  <TextButton title={closeMessage} onPress={onRequestClose} />
                  {buttons}
                </View>
              </View>
            </Ring>
          </View>
        </Container>
        <CloseButtonLayer withBg onPress={onRequestClose} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={closeMessage}
          className="absolute inset-0 -z-10 cursor-default bg-white opacity-80 focus:outline-none dark:bg-black"
          onPress={onRequestClose}
          focusable={false}
        />
      </ScrollView>
    </Modal>
  );
};
