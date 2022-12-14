import { NodeId } from "evolu";
import { FC } from "react";
import { useIntl } from "react-intl";
import { focusClassName } from "../lib/focusClassNames";
import { Button } from "./Button";
import { Text } from "./Text";

export const NodeListPlaceholder: FC<{ ids: readonly NodeId[] }> = ({
  ids,
}) => {
  const intl = useIntl();

  const getMessage = (): string => {
    switch (ids.length) {
      case 0:
        return intl.formatMessage({
          defaultMessage: `Here will be your thoughts, organized.

You can connect anything with anything.
For example: to see - Arrival movie

Write a thought, press enter, and click on the link.
`,
          id: "pZB8g5",
        });
      case 1:
        return intl.formatMessage({
          defaultMessage: "Add something related.",
          id: "LaSyKs",
        });
      default:
        return intl.formatMessage({
          defaultMessage: `You added something else to the filter, and that's how we can filter and connect more thoughts altogether.

For example: to see - Arrival - tomorrow

Of course, you can connect "tomorrow" with "to buy" and anything else.`,
          id: "+vUqCW",
        });
    }
  };

  return (
    <Button focusable={false} onPress={focusClassName("createNodeInput")}>
      <Text className="text-center">{getMessage()}</Text>
    </Button>
  );
};
