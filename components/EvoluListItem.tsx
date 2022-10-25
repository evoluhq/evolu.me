import { String1000 } from "evolu";
import { memo, useCallback, useState } from "react";
import { EvoluId, useMutation } from "../lib/db";
import { EvoluTextInput } from "./EvoluTextInput";

interface EvoluListItemProps {
  row: {
    id: EvoluId;
    title: String1000 | null;
  };
}

export const EvoluListItem = memo<EvoluListItemProps>(
  ({ row: { id, title } }) => {
    const [editTitle, setEditTitle] = useState<string | null>(null);
    const hasChange = editTitle != null && editTitle !== title;
    const { mutate } = useMutation();

    const handleSubmitEditing = useCallback(() => {
      if (hasChange) {
        // `as String1000` because EvoluTextInput maxLength is 1000.
        mutate("evolu", { id, title: editTitle as String1000 }, () => {
          setEditTitle(null);
        });
      } else {
        setEditTitle(null);
      }
    }, [editTitle, hasChange, id, mutate]);

    if (title == null) return null;

    return (
      <EvoluTextInput
        value={editTitle != null ? editTitle : title}
        onChangeText={setEditTitle}
        hasUnsavedChange={hasChange}
        onSubmitEditing={handleSubmitEditing}
        onBlur={handleSubmitEditing}
      />
    );
  }
);

EvoluListItem.displayName = "EvoluListItem";
