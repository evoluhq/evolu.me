import clsx from "clsx";
import { IO } from "fp-ts/IO";
import { FC } from "react";
import { useIntl } from "react-intl";
import { appBg } from "../styles/appBg";
import { Pressable } from "./styled";

export const CloseButtonLayer: FC<{
  onPress: IO<void>;
  withBg?: boolean;
}> = ({ onPress, withBg }) => {
  const intl = useIntl();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={intl.formatMessage({
        defaultMessage: "Close",
        id: "rbrahO",
      })}
      className={clsx(
        "absolute inset-0 -z-10 cursor-default focus:outline-none",
        withBg && clsx("opacity-80", appBg)
      )}
      onPress={onPress}
      focusable={false}
    />
  );
};
