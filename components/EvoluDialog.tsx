import { FC } from "react";
import { EvoluId } from "../lib/db";
import { Dialog } from "./Dialog";
import { Hr } from "./Hr";

// onRequestClose

interface EvoluDialogProps {
  onRequestClose: () => void;
  title: string;
  id: EvoluId;
}

export const EvoluDialog: FC<EvoluDialogProps> = ({
  onRequestClose,
  title,
  // id,
}) => {
  // const intl = useIntl();
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
    <Dialog title={title} onRequestClose={onRequestClose}>
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
              <TextButton
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
