import * as S from "@effect/schema/Schema";
import * as Evolu from "@evolu/react";
import { createEvolu, database, id, table } from "@evolu/react";
import { SqliteDateTime } from "./temporal/castTemporal";
import { Content, ContentMax10k } from "./Lexical";

export const NoteId = id("Note");
export type NoteId = S.Schema.To<typeof NoteId>;

export const NoteTable = table({
  id: NoteId,
  content: ContentMax10k,
  start: SqliteDateTime,
  end: S.nullable(SqliteDateTime),
});
export type NoteTable = S.Schema.To<typeof NoteTable>;

/**
 * The same as {@link NoteTable} but with unlimited content. It's for local
 * modifications; we don't sync note contents immediately on a change.
 */
export const _NoteContentTable = table({
  id: NoteId,
  content: Content,
});

export type _NoteContentTable = S.Schema.To<typeof _NoteContentTable>;

const Database = database({
  note: NoteTable,

  // Tables prefixed with _ are local-only (they don't sync).
  _noteContent: _NoteContentTable,
  _newNote: _NoteContentTable,
});
export type Database = S.Schema.To<typeof Database>;

export const evolu = createEvolu(Database);
export const useEvolu = Evolu.useEvolu<Database>;
