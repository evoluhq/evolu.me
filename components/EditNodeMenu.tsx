import { IO } from "fp-ts/IO";
import { useAtomValue, useSetAtom } from "jotai";
import { FC, memo } from "react";
import { flushSync } from "react-dom";
import { useIntl } from "react-intl";
import { Button } from "../components/Button";
import { View } from "../components/styled";
import { Text } from "../components/Text";
import { editNodeAtom, editNodeHasChangeAtom } from "../lib/atoms";
import { focusClassName, focusClassNames } from "../lib/focusClassNames";
import { KeyboardNavigationProvider } from "../lib/hooks/useKeyNavigation";
import { useNodeEditorButtonKeyNavigation } from "../lib/hooks/useNodeEditorButtonKeyNavigation";

export const useCancelEditModeAndFocusAllLink = () => {
  const setEditNode = useSetAtom(editNodeAtom);

  return () => {
    // So we can focus immediately after.
    flushSync(() => {
      setEditNode(null);
    });
    focusClassName("allLink")();
  };
};

const EditNodeMenuButtons: FC<{ x: number; onSavePress: IO<void> }> = ({
  x,
  onSavePress,
}) => {
  const intl = useIntl();

  const saveKeyNav = useNodeEditorButtonKeyNavigation(0);
  const cancelKeyNav = useNodeEditorButtonKeyNavigation(1);

  const hasChange = useAtomValue(editNodeHasChangeAtom);

  return (
    <View className="flex-row justify-evenly">
      <Button
        {...saveKeyNav}
        focusable={x === 0}
        className={focusClassNames.saveNodeButton}
        disabled={!hasChange}
        onPress={onSavePress}
      >
        <Text as="button" transparent={!hasChange}>
          {intl.formatMessage({ defaultMessage: "Save", id: "jvo0vs" })}
        </Text>
      </Button>
      <Button
        {...cancelKeyNav}
        focusable={x === 1}
        onPress={useCancelEditModeAndFocusAllLink()}
      >
        <Text as="button">
          {intl.formatMessage({ defaultMessage: "Cancel", id: "47FYwb" })}
        </Text>
      </Button>
    </View>
  );
};

export const EditNodeMenu = memo<{ onSavePress: IO<void> }>(
  function EditNodeMenu({ onSavePress }) {
    return (
      <KeyboardNavigationProvider maxX={1}>
        {({ x }) => <EditNodeMenuButtons x={x} onSavePress={onSavePress} />}
      </KeyboardNavigationProvider>
    );
  }
);
