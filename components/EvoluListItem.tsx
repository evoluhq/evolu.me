import { NonEmptyString1000 } from "evolu";
import { memo } from "react";
import { EvoluId } from "../lib/db";
import { EvoluTextInput } from "./EvoluTextInput";

// const editEvoluTitleAtom = atomWithStorage<string[]>(
//   localStorageKeys.editEvoluTitle,
//   []
// );

interface EvoluListItemProps {
  row: {
    id: EvoluId;
    title: NonEmptyString1000 | null;
  };
}

export const EvoluListItem = memo<EvoluListItemProps>(({ row: { title } }) => {
  // const [editname, setEditname] = useAtom(editEvolunameAtom);
  if (title == null) return null;

  // const handleTextInputChange = (value: string) => {
  //   console.log(value);
  // };

  return (
    <EvoluTextInput
      value={title}
      // onChangeText={handleTextInputChange}
    />
  );
});

EvoluListItem.displayName = "EvoluListItem";
