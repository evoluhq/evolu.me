import clsx from "clsx";
import { IO } from "fp-ts/IO";
import { FC, ReactNode } from "react";
import { useIntl } from "react-intl";
import { Modal } from "react-native";
import { accessibility } from "../lib/accessibility";
import { bg, ring } from "../styles";
import { Button } from "./Button";
import { CloseButtonLayer } from "./CloseButtonLayer";
import { Container } from "./Container";
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

  return (
    <Modal transparent onRequestClose={onRequestClose} visible>
      <ScrollView centerContent>
        <Container>
          <View className={clsx("py-4 px-1", ring, bg)}>
            <View className="p-3">
              <Text size="big" mb {...accessibility.heading(1)}>
                {title}
              </Text>
              {children}
              <View className="flex-row gap-2">
                <Button onPress={onRequestClose}>
                  <Text as="roundedButton">
                    {intl.formatMessage({
                      defaultMessage: "Close",
                      id: "rbrahO",
                    })}
                  </Text>
                </Button>
                {buttons}
              </View>
            </View>
          </View>
        </Container>
        <CloseButtonLayer withBg onPress={onRequestClose} />
      </ScrollView>
    </Modal>
  );
};
