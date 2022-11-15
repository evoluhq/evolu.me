import { IO } from "fp-ts/IO";
import { FC } from "react";
import { useIntl } from "react-intl";
import { EvoluId } from "../lib/db";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { Hr } from "./Hr";
import { T } from "./T";

interface EvoluDialogProps {
  onRequestClose: IO<void>;
  onDelete: IO<void>;
  title: string;
  id: EvoluId;
}

export const EvoluDialog: FC<EvoluDialogProps> = ({
  onRequestClose,
  onDelete,
  title,
  // id,
}) => {
  const intl = useIntl();
  // const { rows: toAdd } = useQuery((db) =>
  //   db
  //     .selectFrom("evolu")
  //     .select(["id", "title"])
  //     .orderBy("updatedAt")
  //     .where("isDeleted", "is not", model.cast(true))
  //     .where("id", "!=", id)
  //     .limit(10)
  // );

  return (
    <Dialog
      title={title}
      onRequestClose={onRequestClose}
      buttons={
        <Button onPress={onDelete}>
          <T v="bb">
            {intl.formatMessage({ defaultMessage: "Delete", id: "K3r6DQ" })}
          </T>
        </Button>
      }
    >
      {/* <Paragraph>
        {intl.formatMessage({
          defaultMessage: "Associate it with something else.",
          id: "ZhuZTJ",
        })}
      </Paragraph> */}
      <Hr />
      {/* <View className="mb-4 flex-row">
        {toAdd.map(
          ({ id, title }) =>
            title && (
              <Button...
                title={
                  truncate(title)({
                    maxLength: 14,
                  }).text
                }
                key={id}
                variant="big"
              />
            )
        )}
      </View> */}
    </Dialog>
  );
};
