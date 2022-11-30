import clsx from "clsx";
import { readonlyArray } from "fp-ts";
import { constVoid, pipe } from "fp-ts/function";
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
import { NodeId, useMutation } from "../lib/db";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";
import { setSafeTimeout } from "./setSafeTimeout";
import {
  KeyboardNavigationContext,
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { Popover } from "../components/Popover";
import { Pressable, View } from "../components/styled";
import { T } from "./T";

const EvoluButtonPopoverButtonOrLink: FC<{
  title: string;
  x: number;
  onPressOrHref: IO<void> | string;
  customClassName?: string;
  onRequestClose?: IO<void>;
}> = ({ title, x, onPressOrHref, customClassName, onRequestClose }) => {
  const keyNavigation = useKeyNavigation<RnView>({
    x,
    keys: { ArrowLeft: "previousX", ArrowRight: "nextX" },
  });

  return typeof onPressOrHref === "string" ? (
    <Link href={onPressOrHref}>
      <T
        {...keyNavigation}
        onClick={onRequestClose}
        v="tb"
        customClassName={customClassName}
      >
        {title}
      </T>
    </Link>
  ) : (
    <Button {...keyNavigation} onPress={onPressOrHref}>
      <T v="tb" customClassName={customClassName}>
        {title}
      </T>
    </Button>
  );
};

const EvoluButtonPopover: FC<{
  id: NodeId;
  onRequestClose: IO<void>;
  ownerRef: ForwardedRef<RnView>;
}> = ({ id, onRequestClose, ownerRef }) => {
  const intl = useIntl();
  const { mutate } = useMutation();
  const { move } = useContext(KeyboardNavigationContext);

  const handleDeletePress = () => {
    mutate("node", { id, isDeleted: true }, () => {
      setSafeTimeout(() => move("current"));
    });
  };

  const focusHref = pipe(
    useLocationHashNodeIds(),
    readonlyArray.append(id),
    nodeIdsToLocationHash,
    (s) => `/#${s}`
  );

  return (
    <Popover
      ownerRef={ownerRef}
      position="bottom left to bottom right"
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
            onPressOrHref={focusHref}
            customClassName="rounded-none rounded-l"
            onRequestClose={onRequestClose}
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
  id: NodeId;
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
        className="group -ml-2 w-9 transform-gpu items-center justify-center hover:brightness-90 focus:outline-none active:scale-90"
        onFocus={onFocus}
        // @ts-expect-error RNfW
        onKeyDown={onKeyDown}
        focusable={focusable}
        ref={ref}
        onPress={() => setPopoverIsVisible(true)}
      >
        <View
          className={clsx(
            "h-3 w-3 transform-gpu rounded-sm bg-gray-200 transition-transform duration-100 group-focus-visible:ring-2 dark:bg-gray-800",
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
