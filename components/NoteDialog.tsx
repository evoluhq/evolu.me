import { create, props } from "@stylexjs/stylex";
import { FC, useCallback, useContext, useState } from "react";
import { useEvolu } from "../lib/Db";
import { colors } from "../lib/Tokens.stylex";
import { castTemporal } from "../lib/castTemporal";
import { NowContext } from "../lib/contexts/NowContext";
import { Button } from "./Button";
import { DatePopoverButton } from "./DatePopoverButton";
import type { NotesByDayRow } from "./DayNotes";
import { Dialog } from "./Dialog";
import { EditorOneLine } from "./EditorOneLine";
import { TimePopoverButton } from "./TimePopoverButton";
import { Temporal } from "temporal-polyfill";

export const NoteDialog: FC<{
  row: NotesByDayRow;
  onRequestClose: () => void;
}> = ({ row, onRequestClose }) => {
  const { update } = useEvolu();

  const now = useContext(NowContext);
  const start = castTemporal(now.timeZoneId(), row.start);
  // const end = castTemporal(now.timeZoneId(), row.start);

  const [startTime, setStartTime] = useState(start.toPlainTime());
  const [startDate, setStartDate] = useState(start.toPlainDate());
  // const [endTime, setEndTime] = useState(end.toPlainTime());
  // const [endDate /*, setEndDate*/] = useState(end.toPlainDate());

  const handleDeleteButtonPress = () => {
    update("note", { id: row.id, isDeleted: true }, onRequestClose);
  };

  const handleDialogCancel = useCallback(() => {
    onRequestClose();
  }, [onRequestClose]);

  const handleDialogDone = useCallback(() => {
    const start = castTemporal(
      now.timeZoneId(),
      new Temporal.PlainDateTime(
        startDate.year,
        startDate.month,
        startDate.day,
        startTime.hour,
        startTime.minute,
      ),
    );
    update("note", { id: row.id, start }, onRequestClose);
  }, [
    now,
    onRequestClose,
    row.id,
    startDate.day,
    startDate.month,
    startDate.year,
    startTime.hour,
    startTime.minute,
    update,
  ]);

  return (
    <Dialog
      onRequestClose={onRequestClose}
      onCancel={handleDialogCancel}
      onDone={handleDialogDone}
      containerStyle={styles.dialogContainer}
    >
      <div {...props(styles.editorWrapperForEllipsis)}>
        <EditorOneLine initialValue={row.content.root} />
      </div>
      <div {...props(styles.timeGrid)}>
        <Button title="Starts" variant="app" style={styles.label} />
        <DatePopoverButton
          value={startDate}
          variant="app"
          onChange={setStartDate}
        />
        <TimePopoverButton
          value={startTime}
          variant="app"
          onChange={setStartTime}
        />
        {/* <Button title="Ends" variant="app" style={styles.label} />
        <DatePopoverButton value={endDate} variant="app" onChange={() => {}} />
        <TimePopoverButton
          value={endTime}
          variant="app"
          onChange={setEndTime}
        /> */}
      </div>
      <div {...props(styles.actions)}>
        <Button
          variant="app"
          title="Delete"
          onPress={handleDeleteButtonPress}
          titleStyle={styles.deleteTitle}
        />
      </div>
    </Dialog>
  );
};

const styles = create({
  dialogContainer: {
    maxWidth: "22rem",
  },
  editorWrapperForEllipsis: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  timeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
  },
  label: {
    justifySelf: "start",
  },
  actions: {
    display: "flex",
    justifyContent: "center",
  },
  deleteTitle: {
    color: colors.inactive,
  },
});
