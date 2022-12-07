import { IO } from "fp-ts/IO";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";
import { Modal } from "react-native";
import { accessibility } from "../lib/accessibility";
import { Button } from "./Button";
import { CloseButtonLayer } from "./CloseButtonLayer";
import { Container } from "./Container";
import { Ring } from "./Ring";
import { ScrollView, View } from "./styled";
import { Text } from "./Text";

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
          <Ring className="py-4 px-1">
            <View className="p-3">
              <Text size="big" mb {...accessibility.heading(1)}>
                {title}
              </Text>
              {children}
              <View className="flex-row gap-2">
                <Button onPress={onRequestClose}>
                  <Text as="roundedButton">{closeMessage}</Text>
                </Button>
                {buttons}
              </View>
            </View>
          </Ring>
        </Container>
        <CloseButtonLayer withBg onPress={onRequestClose} />
      </ScrollView>
    </Modal>
  );
};
