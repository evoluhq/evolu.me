import * as S from "@effect/schema/Schema";
import { dequal } from "dequal/lite";
import { EditorState } from "lexical";

// Lexical types that are defined with Schema so we can parse them
// to ensure a valid Schema.
// In the future, NoteEditor will use its format based on Peritext.

const Node = S.Struct({
  version: S.Literal(1),
});
type Node = S.Schema.Type<typeof Node>;

const Element = Node.pipe(
  S.extend(
    S.Struct({
      direction: S.NullOr(S.Literal("ltr", "rtl")),
      format: S.Literal(
        "left",
        "start",
        "center",
        "right",
        "end",
        "justify",
        "",
      ),
      indent: S.Number,
    }),
  ),
);
type Element = S.Schema.Type<typeof Element>;

export const Text = Node.pipe(
  S.extend(
    S.Struct({
      type: S.Literal("text"),
      detail: S.Number,
      format: S.Number,
      mode: S.Literal("normal", "token", "segmented"),
      style: S.String,
      text: S.String,
    }),
  ),
);
export type Text = S.Schema.Type<typeof Text>;

export const LineBreak = Node.pipe(
  S.extend(
    S.Struct({
      type: S.Literal("linebreak"),
    }),
  ),
);
export type LineBreak = S.Schema.Type<typeof LineBreak>;

export const Paragraph = Element.pipe(
  S.extend(
    S.Struct({
      type: S.Literal("paragraph"),
      children: S.Array(S.Union(Text, LineBreak)),
    }),
  ),
);
export type Paragraph = S.Schema.Type<typeof Paragraph>;

export const Root = Element.pipe(
  S.extend(
    S.Struct({
      type: S.Literal("root"),
      // It's mutable in Lexical, so it must be here as well.
      // The array must be non-empty. Lexical can work with empty,
      // but when a text is pasted, it fails with some error.
      children: S.mutable(S.NonEmptyArray(Paragraph)),
    }),
  ),
);
export type Root = S.Schema.Type<typeof Root>;

export const rootsAreEqual = (root1: Root, root2: Root): boolean =>
  // TODO: Remove when Effect supports deep equality (soon)
  dequal(root1, root2);

/**
 * Content is restricted Lexical SerializedEditorState. It must be stored in
 * local-only tables because it can be huge. For the final state, use
 * ContentMax10k.
 */
export const Content = S.Struct({
  _tag: S.Literal("Content"),
  version: S.Literal(1),
  root: Root,
});
export type Content = S.Schema.Type<typeof Content>;

export const contentFromEditorState = (editorState: EditorState) =>
  // decodeUnknown, because Content is more strict than EditorState.
  // Content enforces version 1 (not a number) and Root.type "root" (not a string).
  S.decodeUnknownEither(Content)({
    _tag: "Content",
    version: 1,
    root: editorState.toJSON().root,
  });

/** ContentMax10k is {@link Content} with `JSON.stringify(a).length <= 10000`. */
export const ContentMax10k = Content.pipe(
  S.omit("_tag"),
  S.extend(S.Struct({ _tag: S.Literal("ContentMax10k") })),
  S.filter((a) => JSON.stringify(a).length <= 10000, {
    message: () => "JSON.stringify(a).length > 10000",
  }),
);
export type ContentMax10k = S.Schema.Type<typeof ContentMax10k>;

export const ContentMax10kFromContent = S.transform(Content, ContentMax10k, {
  decode: (a) => ({ ...a, _tag: "ContentMax10k" as const }),
  encode: (a) => ({ ...a, _tag: "Content" as const }),
});

export const emptyRoot: Root = {
  type: "root",
  version: 1,
  direction: null,
  format: "",
  indent: 0,
  children: [
    {
      children: [],
      direction: null,
      format: "",
      indent: 0,
      type: "paragraph",
      version: 1,
    },
  ],
};
