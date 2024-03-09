import { create, props } from "@stylexjs/stylex";
import { Function, Match } from "effect";
import { FC, useCallback, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { useEvolu } from "../lib/Db";
import { colors } from "../lib/Tokens.stylex";
import { useCastTemporal } from "../lib/hooks/useCastTemporal";
import { Button } from "./Button";
import { DatePopoverButton } from "./DatePopoverButton";
import type { NotesByDayRow } from "./DayNotes";
import { Dialog } from "./Dialog";
import { EditorOneLine } from "./EditorOneLine";
import { TimePopoverButton } from "./TimePopoverButton";

export const NoteDialog: FC<{
  row: NotesByDayRow;
  onRequestClose: () => void;
}> = ({ row, onRequestClose }) => {
  const castTemporal = useCastTemporal();
  const { update } = useEvolu();

  const initialStart = castTemporal(row.start);
  const initialEnd = row.end ? castTemporal(row.end) : castTemporal(row.start);

  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);

  const startEndComparison = Temporal.PlainDateTime.compare(start, end);

  const handleDialogDone = useCallback(() => {
    if (startEndComparison === 1) {
      alert("The start date must be before the end date.");
      return;
    }

    const values = {
      start: castTemporal(start),
      // Don't duplicate the start if it's not necessary.
      end: startEndComparison === 0 ? null : castTemporal(end),
    };

    if (values.start === row.start && values.end === row.end) {
      onRequestClose();
    } else {
      update("note", { id: row.id, ...values }, onRequestClose);
    }
  }, [
    castTemporal,
    end,
    onRequestClose,
    row.end,
    row.id,
    row.start,
    start,
    startEndComparison,
    update,
  ]);

  const endTitleStyle = Match.value(startEndComparison).pipe(
    Match.when(0, () => styles.secondaryColor),
    Match.when(1, () => styles.lineThroughTextDecoration),
    Match.orElse(Function.constNull),
  );

  return (
    <Dialog
      onRequestClose={onRequestClose}
      onCancel={() => {
        onRequestClose();
      }}
      onDone={handleDialogDone}
      containerStyle={styles.dialogContainer}
    >
      <div {...props(styles.editorWrapperForEllipsis)}>
        <EditorOneLine initialValue={row.content.root} />
      </div>
      <div {...props(styles.buttons)}>
        <DatePopoverButton
          value={start.toPlainDate()}
          variant="app"
          onChange={({ day, month, year }) => {
            setStart(start.with({ day, month, year }));
            // If the start and end were equal, update the end as well.
            if (startEndComparison === 0) {
              setEnd(start.with({ day, month, year }));
            }
          }}
        />
        <TimePopoverButton
          value={start.toPlainTime()}
          variant="app"
          onChange={({ hour, minute }) => {
            setStart(start.with({ hour, minute }));
            // If the start and end were equal, update the end as well.
            if (startEndComparison === 0) {
              setEnd(start.with({ hour, minute }));
            }
          }}
        />
      </div>
      <div {...props(styles.buttons)}>
        <DatePopoverButton
          value={end.toPlainDate()}
          variant="app"
          onChange={({ day, month, year }) => {
            setEnd(end.with({ day, month, year }));
          }}
          titleStyle={endTitleStyle}
        />
        <TimePopoverButton
          value={end.toPlainTime()}
          variant="app"
          onChange={({ hour, minute }) => {
            setEnd(end.with({ hour, minute }));
          }}
          titleStyle={endTitleStyle}
        />
      </div>
      <div {...props(styles.buttons)}>
        <Button
          variant="app"
          title="Delete"
          onPress={() => {
            update("note", { id: row.id, isDeleted: true }, onRequestClose);
          }}
          style={styles.centeredButton}
          titleStyle={styles.secondaryColor}
        />
      </div>
    </Dialog>
  );
};

const styles = create({
  dialogContainer: {
    maxWidth: "20rem",
  },
  editorWrapperForEllipsis: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
  },
  centeredButton: {
    // No flex: 1 because we don't want full width.
    margin: "auto",
  },
  secondaryColor: {
    color: colors.secondary,
  },
  lineThroughTextDecoration: {
    textDecoration: "line-through",
  },
});
