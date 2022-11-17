import clsx from "clsx";
import { constVoid } from "fp-ts/function";
import { IO } from "fp-ts/IO";
import {
  FC,
  ForwardedRef,
  forwardRef,
  KeyboardEvent,
  useContext,
  useState,
} from "react";
import { useIntl } from "react-intl";
import { View as RnView } from "react-native";
import { EvoluId, useMutation } from "../lib/db";
import { setSafeTimeout } from "../lib/setSafeTimeout";
import {
  KeyboardNavigationContext,
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/useKeyNavigation";
import { Button } from "./Button";
import { Link } from "./Link";
import { Popover } from "./Popover";
import { Pressable, View } from "./styled";
import { T } from "./T";

const EvoluButtonPopoverButtonOrLink: FC<{
  title: string;
  x: number;
  onPressOrHref: IO<void> | string;
  customClassName?: string;
}> = ({ title, x, onPressOrHref, customClassName }) => {
  const keyNavigation = useKeyNavigation<RnView>({
    x,
    keys: { ArrowLeft: "previousX", ArrowRight: "nextX" },
  });

  return typeof onPressOrHref === "string" ? (
    <Link href={onPressOrHref}>
      <T {...keyNavigation} v="tb" customClassName={customClassName}>
        {title}
      </T>
    </Link>
  ) : (
    <Button {...keyNavigation}>
      <T v="tb" customClassName={customClassName}>
        {title}
      </T>
    </Button>
  );
};

const EvoluButtonPopover: FC<{
  id: EvoluId;
  onRequestClose: IO<void>;
  ownerRef: ForwardedRef<RnView>;
}> = ({ id, onRequestClose, ownerRef }) => {
  const intl = useIntl();
  const { mutate } = useMutation();
  const { move } = useContext(KeyboardNavigationContext);

  const handleDeletePress = () => {
    mutate("evolu", { id, isDeleted: true }, () => {
      setSafeTimeout(() => move("current"));
    });
  };

  return (
    <Popover
      ownerRef={ownerRef}
      position="bottom right to right"
      onRequestClose={onRequestClose}
    >
      <View className="flex-row">
        <KeyboardNavigationProvider maxX={2}>
          <EvoluButtonPopoverButtonOrLink
            title={intl.formatMessage({
              defaultMessage: "Focus",
              id: "hsJlm7",
            })}
            x={0}
            onPressOrHref={"/#foo"}
            customClassName="rounded-none rounded-l"
          />
          <EvoluButtonPopoverButtonOrLink
            title="Move"
            x={1}
            onPressOrHref={constVoid}
            customClassName="rounded-none"
          />
          <EvoluButtonPopoverButtonOrLink
            title="Delete"
            x={2}
            onPressOrHref={handleDeletePress}
            customClassName="rounded-none rounded-r"
          />
        </KeyboardNavigationProvider>
      </View>
    </Popover>
  );
};

export interface EvoluButton {
  focusable: boolean;
  onFocus: IO<void>;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  id: EvoluId;
  title: string;
}

export const EvoluButton = forwardRef<RnView, EvoluButton>(function EvoluButton(
  { focusable, onFocus, onKeyDown, id },
  ref
) {
  const intl = useIntl();
  const [popoverIsVisible, setPopoverIsVisible] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={intl.formatMessage({
          defaultMessage: "Show detail",
          id: "z7JWlo",
        })}
        className="group -ml-2 w-9 items-center justify-center hover:brightness-90 focus:outline-none active:scale-90"
        onFocus={onFocus}
        // @ts-expect-error RNfW
        onKeyDown={onKeyDown}
        focusable={focusable}
        ref={ref}
        onPress={() => setPopoverIsVisible(true)}
      >
        <View
          className={clsx(
            "h-3 w-3 rounded-sm bg-gray-200 transition-transform duration-100 group-focus-visible:ring-2 dark:bg-gray-800",
            popoverIsVisible && "rotate-45"
          )}
        />
      </Pressable>
      {popoverIsVisible && (
        <EvoluButtonPopover
          id={id}
          onRequestClose={() => setPopoverIsVisible(false)}
          ownerRef={ref}
        />
      )}
    </>
  );
});
