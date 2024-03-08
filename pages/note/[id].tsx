import * as S from "@effect/schema/Schema";
import { ExtractRow, NotNull, cast, useQueries } from "@evolu/react";
import { create, props } from "@stylexjs/stylex";
import { Either } from "effect";
import Error from "next/error";
import { useRouter } from "next/router";
import { FC, memo, useCallback, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { Button } from "../../components/Button";
import { Editor } from "../../components/Editor";
import { RouterQuery } from "../../components/RouterQuery";
import { NoteId, evolu, useEvolu } from "../../lib/Db";
import {
  Content,
  ContentMax10kFromContent,
  rootsAreEqual,
} from "../../lib/Lexical";
import { appSpacing } from "../../lib/Themes";
import { baseline, colors, consts, spacing } from "../../lib/Tokens.stylex";
import { RNfW } from "../../lib/Types";
import { SqliteDateTime } from "../../lib/castTemporal";
import { useCastTemporal } from "../../lib/hooks/useCastTemporal";
import { useGetDayUrl } from "../../lib/hooks/useGetDayUrl";
import { useOnUserLeave } from "../../lib/hooks/useOnUserLeave";

const NoteProps = S.struct({ id: NoteId });
type NoteProps = S.Schema.To<typeof NoteProps>;

const Note: FC = () => (
  <RouterQuery
    schema={NoteProps}
    render={(props) => <NoteLoader {...props} />}
  />
);

export default Note;

const noteById = (id: NoteId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom("note")
      .select(["content", "start"])
      .where("content", "is not", null)
      .where("start", "is not", null)
      .$narrowType<{ content: NotNull; start: NotNull }>()
      .where("id", "=", id),
  );
type NoteByIdRow = ExtractRow<ReturnType<typeof noteById>>;

const _noteContentById = (id: NoteId) =>
  evolu.createQuery((db) =>
    db
      .selectFrom("_noteContent")
      .select(["content"])
      .where("content", "is not", null)
      .$narrowType<{ content: NotNull }>()
      .where("id", "=", id),
  );
type _NoteContentByIdRow = ExtractRow<ReturnType<typeof _noteContentById>>;

const NoteLoader: FC<NoteProps> = ({ id }) => {
  const [{ row: note }, { row: _note }] = useQueries([], {
    once: [noteById(id), _noteContentById(id)],
  });
  if (note == null) return <Error statusCode={404} />;
  return <NoteLoaded id={id} initialNote={note} initial_NoteContent={_note} />;
};

const NoteLoaded = memo<{
  id: NoteId;
  initialNote: NoteByIdRow;
  initial_NoteContent: _NoteContentByIdRow | null;
}>(function NoteWithData({ id, initialNote, initial_NoteContent }) {
  const initialRoot =
    initial_NoteContent?.content.root || initialNote.content.root;
  const { update } = useEvolu();

  // TODO: "document too long" warning via setState
  const [, setEditorContent] = useState<Content>();

  // Can't be state because of `useOnUserLeave`.
  const editorContentRef = useRef<Content>();

  const handleEditorChange = useCallback(
    (content: Content) => {
      setEditorContent(content);
      editorContentRef.current = content;
      update("_noteContent", { id, content });
    },
    [id, update],
  );

  const lastSavedRef = useRef(initialRoot);

  /**
   * The editor holds the state and saves it into a local-only table _Note. By
   * that, document changes are immediately stored but not synced because that
   * would be costly; remember, we store the whole document, not a diff. The
   * document is saved into a regular Evolu table when a user leaves.
   *
   * Other Note props can be synced immediately.
   */
  useOnUserLeave(
    useCallback(() => {
      if (!editorContentRef.current) return;
      S.decodeEither(ContentMax10kFromContent)(editorContentRef.current).pipe(
        Either.match({
          onLeft: () => {
            alert("Too long, sorry.");
          },
          onRight: (editorContent) => {
            if (rootsAreEqual(editorContent.root, lastSavedRef.current)) return;
            evolu.update("note", { id, content: editorContent });
            evolu.update("_noteContent", { id, isDeleted: cast(true) });
            lastSavedRef.current = editorContent.root;
          },
        }),
      );
    }, [id]),
  );

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainer as RNfW}
      >
        <div {...props(styles.centered)}>
          <Editor
            initialValue={initialRoot}
            onChange={handleEditorChange}
            noPlaceholder
            isVisible
          />
        </div>
      </ScrollView>
      <Footer start={initialNote.start} />
    </>
  );
});

const Footer = memo<{ start: SqliteDateTime }>(function Footer({ start }) {
  const router = useRouter();
  const getDayUrl = useGetDayUrl();
  const castTemporal = useCastTemporal();

  const handleCalendarPress = () => {
    void router.push(getDayUrl(castTemporal(start).toPlainDate()));
  };

  return (
    <div {...props([appSpacing, styles.footer])}>
      <Button
        title={"Calendar"}
        variant="webBig"
        titleStyle={styles.buttonTitle}
        onPress={handleCalendarPress}
      />
    </div>
  );
});

const styles = create({
  scrollViewContentContainer: {
    minHeight: "100%",
  },
  centered: {
    width: "100%",
    maxWidth: consts.maxWidth,
    marginInline: "auto",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    paddingInline: spacing.m,
    // Header is 44px height, compensate it for the content baseline.
    paddingTop: `calc(1 * ${spacing.m} + (2 * ${baseline.web} - 2 * ${baseline.app}))`,
    minHeight: 0, // https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/#the-minimum-size-gotcha-11
  },
  footer: {
    width: "100%",
    maxWidth: consts.maxWidth,
    marginInline: "auto",
    display: "flex",
    justifyContent: "space-evenly",
  },
  buttonTitle: {
    color: colors.inactive,
  },
});
