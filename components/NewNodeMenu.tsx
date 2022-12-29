import clsx from "clsx";
import { FC, memo } from "react";
import { useIntl } from "react-intl";
import { Button } from "../components/Button";
import { Link } from "../components/Link";
import { View } from "../components/styled";
import { Text } from "../components/Text";
import { focusClassNames } from "../lib/focusClassNames";
import { KeyboardNavigationProvider } from "../lib/hooks/useKeyNavigation";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { useNodeEditorButtonKeyNavigation } from "../lib/hooks/useNodeEditorButtonKeyNavigation";

const NewNodeMenuButtons: FC<{ x: number }> = ({ x }) => {
  const intl = useIntl();

  const allKeyNav = useNodeEditorButtonKeyNavigation(0);
  const searchKeyNav = useNodeEditorButtonKeyNavigation(1);
  const ids = useLocationHashNodeIds();

  return (
    <View className="flex-row justify-evenly">
      <Link href="/">
        <Text
          as="link"
          p
          transparent={ids.length > 0}
          className={clsx(focusClassNames.allLink, "my-1 py-1")}
          {...allKeyNav}
          // @ts-expect-error RNfW
          focusable={x === 0}
        >
          {intl.formatMessage({ defaultMessage: "All", id: "zQvVDJ" })}
        </Text>
      </Link>
      <Button {...searchKeyNav} focusable={x === 1}>
        <Text as="button" transparent>
          {intl.formatMessage({ defaultMessage: "Search", id: "xmcVZ0" })}
        </Text>
      </Button>
    </View>
  );
};

export const NewNodeMenu = memo(function NewNodeMenu() {
  return (
    <KeyboardNavigationProvider maxX={1}>
      {({ x }) => <NewNodeMenuButtons x={x} />}
    </KeyboardNavigationProvider>
  );
});
