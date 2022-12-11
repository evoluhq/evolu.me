import { FC } from "react";
import { useIntl } from "react-intl";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Link } from "../components/Link";
import { NodeEditorLexical } from "../components/NodeEditorLexical";
import { View } from "../components/styled";
import { Text } from "../components/Text";
import { focusClassName, focusClassNames } from "../lib/focusClassNames";
import { useAddNodeMutation } from "../lib/hooks/useAddNodeMutation";
import {
  KeyboardNavigationProvider,
  useKeyNavigation,
} from "../lib/hooks/useKeyNavigation";

// TODO: Persist new state into local storage.
// const newNodeTitleAtom = atomWithStorage(localStorageKeys.newNodeTitle, "");
// const [title, setTitle] = useAtom(newNodeTitleAtom);

const Toolbar: FC<{ x: number }> = ({ x }) => {
  const intl = useIntl();

  const keys = {
    ArrowLeft: "previousX",
    ArrowRight: "nextX",
    ArrowUp: focusClassName("createNodeInput"),
  } as const;

  const allKeyNav = useKeyNavigation({ x: 0, keys });
  const searchKeyNav = useKeyNavigation({ x: 1, keys });

  return (
    <View className="flex-row justify-evenly">
      <Link href="/">
        <Text
          as="link"
          p
          className={focusClassNames.allLink}
          {...allKeyNav}
          // @ts-expect-error RNfW
          focusable={x === 0}
        >
          {intl.formatMessage({
            defaultMessage: "All",
            id: "zQvVDJ",
          })}
        </Text>
      </Link>
      <Button {...searchKeyNav} focusable={x === 1}>
        <Text as="button">
          {intl.formatMessage({
            defaultMessage: "Search",
            id: "xmcVZ0",
          })}
        </Text>
      </Button>
    </View>
  );
};

export const NodeEditor: FC = () => {
  const addNodeMutation = useAddNodeMutation();

  return (
    <Container className="pb-0">
      <NodeEditorLexical onSubmit={addNodeMutation} />
      <KeyboardNavigationProvider maxX={1}>
        {({ x }) => <Toolbar x={x} />}
      </KeyboardNavigationProvider>
    </Container>
  );
};
