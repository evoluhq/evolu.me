import { FC } from "react";
import { useIntl } from "react-intl";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { Link } from "../components/Link";
import { NodeEditorLexical } from "../components/NodeEditorLexical";
import { View } from "../components/styled";
import { Text } from "../components/Text";
import { useAddNodeMutation } from "../lib/hooks/useAddNodeMutation";

// TODO: Persist new state into local storage.
// const newNodeTitleAtom = atomWithStorage(localStorageKeys.newNodeTitle, "");
// const [title, setTitle] = useAtom(newNodeTitleAtom);

export const NodeEditor: FC = () => {
  const intl = useIntl();
  const addNodeMutation = useAddNodeMutation();

  return (
    <Container className="pb-0">
      <NodeEditorLexical onSubmit={addNodeMutation} />
      <View className="flex-row justify-evenly">
        <Link href="/">
          <Text as="link" p>
            {intl.formatMessage({
              defaultMessage: "All",
              id: "zQvVDJ",
            })}
          </Text>
        </Link>
        <Button>
          <Text as="button">
            {intl.formatMessage({
              defaultMessage: "Search",
              id: "xmcVZ0",
            })}
          </Text>
        </Button>
      </View>
    </Container>
  );
};
