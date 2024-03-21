import * as S from "@effect/schema/Schema";
import * as Evolu from "@evolu/react";
import { createEvolu, database, id, table } from "@evolu/react";
import { Content, ContentMax10k } from "./Lexical";
import { SqliteDateTime } from "./temporal/castTemporal";

export const NoteId = id("Note");
export type NoteId = S.Schema.Type<typeof NoteId>;

export const NoteTable = table({
  id: NoteId,
  content: ContentMax10k,
  start: SqliteDateTime,
  end: S.nullable(SqliteDateTime),
});
export type NoteTable = S.Schema.Type<typeof NoteTable>;

/**
 * The same as {@link NoteTable} but with unlimited content. It's for local
 * modifications; we don't sync note contents immediately on a change.
 */
export const _NoteContentTable = table({
  id: NoteId,
  content: Content,
});
export type _NoteContentTable = S.Schema.Type<typeof _NoteContentTable>;

const Database = database({
  note: NoteTable,

  // Tables prefixed with _ are local-only (they don't sync).
  _noteContent: _NoteContentTable,
  _newNote: _NoteContentTable,
});
export type Database = S.Schema.Type<typeof Database>;

const indexes = [
  Evolu.createIndex("indexNoteStart").on("note").column("start"),
];

export const evolu = createEvolu(Database, {
  name: "Evolu.me",
  indexes,
});
export const useEvolu = Evolu.useEvolu<Database>;
