import { ExtractRow, NotNull, cast, useQuery } from "@evolu/react";
import { create, props } from "@stylexjs/stylex";
import { FC, memo, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { evolu } from "../lib/Db";
import { getNoteUrl } from "../lib/Routing";
import { spacing } from "../lib/Tokens.stylex";
import { SqliteDateTime } from "../lib/temporal/castTemporal";
import { useCastTemporal } from "../lib/hooks/useCastTemporal";
import { Button } from "./Button";
import { EditorOneLine } from "./EditorOneLine";
import { Formatted } from "./Formatted";
import { Link } from "./Link";
import { NoteDialog } from "./NoteDialog";

// TODO:
// SELECT *
// FROM Note
// WHERE start BETWEEN '2024-02-08 00:00:00' AND '2024-02-08 23:59:59'
//    OR COALESCE(end, start) BETWEEN '2024-02-08 00:00:00' AND '2024-02-08 23:59:59'
//    OR (start <= '2024-02-08 00:00:00' AND COALESCE(end, start) >= '2024-02-08 23:59:59');
const notesByDay = (startOfDay: SqliteDateTime, endOfDay: SqliteDateTime) =>
  evolu.createQuery((db) =>
    db
      .selectFrom("note")
      .select(["id", "content", "start", "end"])
      .where("isDeleted", "is not", cast(true))
      // Filter null value and ensure non-null type.
      .where("content", "is not", null)
      .where("start", "is not", null)
      .$narrowType<{ content: NotNull; start: NotNull }>()
      .where((eb) => eb.between("start", startOfDay, endOfDay))
      .orderBy(["start"]),
  );

export type NotesByDayRow = ExtractRow<ReturnType<typeof notesByDay>>;

export const DayNotes: FC<{
  day: Temporal.PlainDate;
  isVisible: boolean;
}> = ({ day, isVisible }) => {
  const castTemporal = useCastTemporal();
  const startOfDay = castTemporal(
    day.toPlainDateTime(Temporal.PlainTime.from("00:00")),
  );
  const endOfDay = castTemporal(
    day.toPlainDateTime(Temporal.PlainTime.from("23:59:59")),
  );
  const { rows } = useQuery(notesByDay(startOfDay, endOfDay));
  return rows.map((row) => (
    <DayNote key={row.id} row={row} isVisible={isVisible} />
  ));
};

const DayNote = memo<{
  row: NotesByDayRow;
  isVisible: boolean;
}>(function DayNote({ row, isVisible }) {
  return (
    <div {...props(styles.container)}>
      <TimeButton row={row} isVisible={isVisible} />
      <div {...props(styles.secondColumn)}>
        <Link
          href={getNoteUrl(row.id)}
          pressableStyle={styles.noteLinkPressable}
          style={styles.noteLink}
          /**
           * TODO: tabIndex must be allowed only for the current DayBody
           * Carousel item. Otherwise, tab navigation will scroll to the
           * previous day. Add scrolling by key left/right arrows.
           */
          tabIndex={isVisible ? 0 : -1}
        >
          <EditorOneLine initialValue={row.content.root} key={row.id} />
        </Link>
        {/* <Tags tags={["home"]} /> */}
      </div>
    </div>
  );
});

const TimeButton: FC<{
  row: NotesByDayRow;
  isVisible: boolean;
}> = ({ row, isVisible }) => {
  const [dialogIsShown, setDialogIsShown] = useState(false);

  const handleButtonPress = () => {
    setDialogIsShown(true);
  };

  const handleNoteDialogOnRequestClose = () => {
    setDialogIsShown(false);
  };

  const castTemporal = useCastTemporal();
  const start = castTemporal(row.start).toPlainTime();

  return (
    <>
      {dialogIsShown && (
        <NoteDialog row={row} onRequestClose={handleNoteDialogOnRequestClose} />
      )}
      <Button
        /**
         * TODO: tabIndex must be allowed only for the current DayBody Carousel
         * item. Otherwise, tab navigation will scroll to the previous day. Add
         * scrolling by key left/right arrows.
         */
        tabIndex={isVisible ? 0 : -1}
        variant="appSmall"
        style={styles.timeButtonPressable}
        title={
          <>
            <Formatted value={start} />
            {/* {end && (
              <>
                <br />
                <TimeButtonDigits time={end} />
              </>
            )} */}
          </>
        }
        onPress={handleButtonPress}
      />
    </>
  );
};

// const Tags: FC<{ tags: ReadonlyArray<string> }> = ({ tags }) => {
//   return (
//     <div {...props(styles.tags)}>
//       <EnsureBaseline style={styles.tagsEnsureBaseLine} />
//       {tags.map((tag, i) => {
//         return (
//           <Button
//             key={i}
//             variant="appSmall"
//             title={tag}
//             pressableStyle={styles.tagPressable}
//             titleStyle={styles.tagTitle}
//           />
//         );
//       })}
//     </div>
//   );
// };

const styles = create({
  container: {
    display: "flex",
    alignItems: "baseline",
  },
  timeButtonPressable: {
    flex: 1,
    height: spacing.l,
    zIndex: 1,
    paddingTop: spacing.xxs,
    marginBottom: `calc(-1 * ${spacing.xxxs})`, // compensate paddingTop
  },
  secondColumn: {
    flex: 6,
    display: "flex",
    flexWrap: "wrap",
    minWidth: 0, // https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/#the-minimum-size-gotcha-11
  },
  noteLinkPressable: {
    flex: 1,
  },
  noteLink: {
    lineHeight: spacing.l as unknown as number,
  },
  tags: {
    display: "flex",
    alignItems: "baseline",
  },
  tagsEnsureBaseLine: {
    lineHeight: spacing.l as unknown as number,
  },
  tagPressable: {
    height: "100%",
    zIndex: 1,
    paddingTop: spacing.xxs,
    marginBottom: `calc(-1 * ${spacing.xxxs})`, // for timeButtonTitle padding
    minWidth: 44,
  },
  tagTitle: {
    //
  },
});
