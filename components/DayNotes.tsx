import { ExtractRow, NotNull, cast, useQuery } from "@evolu/react";
import { create, props } from "@stylexjs/stylex";
import { Array, pipe } from "effect";
import { FC, memo, useMemo, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { evolu } from "../lib/Db";
import { getNoteUrl } from "../lib/Routing";
import { spacing } from "../lib/Tokens.stylex";
import { useCastTemporal } from "../lib/hooks/useCastTemporal";
import { SqliteDateTime } from "../lib/temporal/castTemporal";
import { Button } from "./Button";
import { EditorOneLine } from "./EditorOneLine";
import { Formatted } from "./Formatted";
import { Link } from "./Link";
import { NoteDialog } from "./NoteDialog";

const notesByDay = (startOfDay: SqliteDateTime, endOfDay: SqliteDateTime) =>
  evolu.createQuery((db) =>
    db
      .selectFrom("note")
      .select(["id", "content", "start", "end"])
      // Filter null value and ensure non-null type.
      .where("content", "is not", null)
      .where("start", "is not", null)
      .$narrowType<{ content: NotNull; start: NotNull }>()
      .where("isDeleted", "is not", cast(true))
      .where((eb) =>
        eb.or([
          // Note starts on the date.
          eb.between("start", startOfDay, endOfDay),
          // Note ends on the date.
          eb.between(eb.fn.coalesce("end", "start"), startOfDay, endOfDay),
          // Note spans over the date.
          eb.and([
            eb("start", "<=", startOfDay),
            eb(eb.fn.coalesce("end", "start"), ">=", endOfDay),
          ]),
        ]),
      )
      .orderBy(["start"]),
  );

export type NotesByDayRow = ExtractRow<ReturnType<typeof notesByDay>>;

type NotesByDayRowWithComparison = NotesByDayRow & {
  startsBefore: boolean;
  endsAfter: boolean;
};

export const DayNotes: FC<{
  day: Temporal.PlainDate;
  isVisible: boolean;
}> = ({ day, isVisible }) => {
  const castTemporal = useCastTemporal();

  const startOfDay = day.toPlainDateTime(Temporal.PlainTime.from("00:00"));
  const endOfDay = day.toPlainDateTime(Temporal.PlainTime.from("23:59:59"));

  const { rows } = useQuery(
    notesByDay(castTemporal(startOfDay), castTemporal(endOfDay)),
  );

  const sortedRowsWithComparison = useMemo(
    () =>
      pipe(
        rows.map(
          (row): NotesByDayRowWithComparison => ({
            ...row,
            startsBefore:
              Temporal.PlainDateTime.compare(
                castTemporal(row.start),
                startOfDay,
              ) === -1,
            endsAfter:
              row.end != null &&
              Temporal.PlainDateTime.compare(
                castTemporal(row.end),
                endOfDay,
              ) === 1,
          }),
        ),
        // Overlapping notes first, then startsBefore, then rest.
        Array.partition((row) => row.startsBefore && row.endsAfter),
        ([rest, overlapping]) =>
          overlapping.concat(
            ...Array.partition(rest, (row) => !row.startsBefore),
          ),
      ),
    [castTemporal, endOfDay, rows, startOfDay],
  );

  return sortedRowsWithComparison.map((row) => (
    <DayNote key={row.id} row={row} isVisible={isVisible} />
  ));
};

const DayNote = memo<{
  row: NotesByDayRowWithComparison;
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
  row: NotesByDayRowWithComparison;
  isVisible: boolean;
}> = ({ row, isVisible }) => {
  const castTemporal = useCastTemporal();
  const [dialogIsShown, setDialogIsShown] = useState(false);

  const handleButtonPress = () => {
    setDialogIsShown(true);
  };

  const handleNoteDialogOnRequestClose = () => {
    setDialogIsShown(false);
  };

  return (
    <>
      {dialogIsShown && (
        <NoteDialog row={row} onRequestClose={handleNoteDialogOnRequestClose} />
      )}
      <Button
        /**
         * The tabIndex must be allowed only for the current DayBody Carousel
         * item. Otherwise, tab navigation will scroll to the previous day.
         */
        tabIndex={isVisible ? 0 : -1}
        variant="appSmall"
        style={styles.timeButtonPressable}
        title={
          row.startsBefore && row.endsAfter ? (
            <>
              <span {...props(styles.arrowLeft)}>←</span>
              <span {...props(styles.arrowRight)}>→</span>
            </>
          ) : (
            <>
              {row.startsBefore ? (
                <span {...props(styles.arrowLeft)}>←</span>
              ) : (
                <Formatted value={castTemporal(row.start).toPlainTime()} />
              )}
              {row.end && (
                <>
                  <br />
                  {row.endsAfter ? (
                    <span {...props(styles.arrowRight)}>→</span>
                  ) : (
                    <Formatted value={castTemporal(row.end).toPlainTime()} />
                  )}
                </>
              )}
            </>
          )
        }
        onPress={handleButtonPress}
      />
    </>
  );
};

// const Tags: FC<{ tags: Array<string> }> = ({ tags }) => {
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
  arrowLeft: {
    display: "inline-block",
    width: "100%",
    textAlign: "left",
  },
  arrowRight: {
    display: "inline-block",
    width: "100%",
    textAlign: "right",
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
