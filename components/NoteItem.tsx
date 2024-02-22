import { FC, ReactNode, memo } from "react";
import { Temporal } from "temporal-polyfill";
import { spacing } from "../lib/Tokens.stylex";
import { Button } from "./Button";
import { EnsureBaseline } from "./EnsureBaseline";
import { Link } from "./Link";
import { create, props } from "@stylexjs/stylex";

// TODO: Remove it.
export const NoteItem = memo(function NoteItem() {
  return (
    <>
      <div {...props(styles.container)}>
        <TimeButton start={Temporal.PlainTime.from("01:30")} />
        <div {...props(styles.secondColumn)}>
          <NoteLink>Zalejt kytky</NoteLink>
          <Tags tags={["home"]} />
        </div>
      </div>
      <div {...props(styles.container)}>
        <TimeButton
          start={Temporal.PlainTime.from("12:00")}
          end={Temporal.PlainTime.from("14:00")}
        />
        <div {...props(styles.secondColumn)}>
          <NoteLink>
            Oběd s Bacíkovou, probrat Evolu firmu, teď by to možná mohlo vyjít.
            Zeptat se jí na to, jak raisovat peníze. Jakou jinou radu by mi
            dala?
          </NoteLink>
          <Tags
            tags={[
              "evolu",
              "people",
              "‼️",
              // "pes",
              // "kocka",
              // "krasa",
              // "masakr",
              // "omg",
              // "pana",
              // "anal",
            ]}
          />
        </div>
      </div>
      <div {...props(styles.container)}>
        <TimeButton start={Temporal.PlainTime.from("16:30")} />
        <div {...props(styles.secondColumn)}>
          <NoteLink>Fitko</NoteLink>
          <Tags tags={["sport"]} />
        </div>
      </div>
      <div {...props(styles.container)}>
        <TimeButton start={Temporal.PlainTime.from("18:00")} />
        <div {...props(styles.secondColumn)}>
          <NoteLink>Eva rande</NoteLink>
          <Tags tags={["Sex"]} />
        </div>
      </div>
      <div {...props(styles.container)}>
        <TimeButton start={Temporal.PlainTime.from("21:20")} />
        <div {...props(styles.secondColumn)}>
          <NoteLink>Call s Janotou</NoteLink>
          <Tags tags={["evolu", "lidi", "crdt"]} />
        </div>
      </div>
    </>
  );
});

const TimeButton: FC<{
  start: Temporal.PlainTime;
  end?: Temporal.PlainTime;
}> = ({ start, end }) => {
  return (
    <Button
      /**
       * TODO: tabIndex must be allowed only for the current DayBody Carousel
       * item. Otherwise, tab navigation will scroll to the previous day. Add
       * scrolling by key left/right arrows.
       */
      tabIndex={-1}
      variant="appSmall"
      style={styles.timeButtonPressable}
      titleStyle={styles.timeButtonTitle}
      title={
        <>
          <TimeButtonDigits time={start} />
          {end && (
            <>
              <br />
              <TimeButtonDigits time={end} />
            </>
          )}
        </>
      }
    />
  );
};

const TimeButtonDigits: FC<{ time: Temporal.PlainTime }> = ({
  time: { hour, minute },
}) => {
  const hourString = hour.toString().padStart(2, "0");
  const minuteString = minute.toString().padStart(2, "0");
  return hourString.startsWith("0") ? (
    <>
      <span {...props(styles.timeButtonDigitsInvisibleZero)}>0</span>
      {hourString.slice(1)}:{minuteString}
    </>
  ) : (
    `${hourString}:${minuteString}`
  );
};

const NoteLink: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Link
      href="/"
      pressableStyle={styles.noteLinkPressable}
      style={styles.noteLink}
      /**
       * TODO: tabIndex must be allowed only for the current DayBody Carousel
       * item. Otherwise, tab navigation will scroll to the previous day. Add
       * scrolling by key left/right arrows.
       */
      tabIndex={-1}
    >
      {children}
    </Link>
  );
};

const Tags: FC<{ tags: ReadonlyArray<string> }> = ({ tags }) => {
  return (
    <div {...props(styles.tags)}>
      <EnsureBaseline style={styles.tagsEnsureBaseLine} />
      {tags.map((tag, i) => {
        return (
          <Button
            key={i}
            variant="appSmall"
            title={tag}
            style={styles.tagPressable}
            titleStyle={styles.tagTitle}
          />
        );
      })}
    </div>
  );
};

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
    marginBottom: `calc(-1 * ${spacing.xxxs})`, // for timeButtonTitle padding
  },
  timeButtonTitle: {
    textAlign: "right",
  },
  timeButtonDigitsInvisibleZero: {
    visibility: "hidden",
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
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
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
