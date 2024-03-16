import * as S from "@effect/schema/Schema";
import { dequal } from "dequal/lite";
import { EditorState } from "lexical";

// Lexical types that are defined with Schema so we can parse them
// to ensure a valid Schema.
// In the future, NoteEditor will use its format based on Peritext.

const Node = S.struct({
  version: S.literal(1),
});
type Node = S.Schema.Type<typeof Node>;

const Element = Node.pipe(
  S.extend(
    S.struct({
      direction: S.nullable(S.literal("ltr", "rtl")),
      format: S.literal(
        "left",
        "start",
        "center",
        "right",
        "end",
        "justify",
        "",
      ),
      indent: S.number,
    }),
  ),
);
type Element = S.Schema.Type<typeof Element>;

export const Text = Node.pipe(
  S.extend(
    S.struct({
      type: S.literal("text"),
      detail: S.number,
      format: S.number,
      mode: S.literal("normal", "token", "segmented"),
      style: S.string,
      text: S.string,
    }),
  ),
);
export type Text = S.Schema.Type<typeof Text>;

export const LineBreak = Node.pipe(
  S.extend(
    S.struct({
      type: S.literal("linebreak"),
    }),
  ),
);
export type LineBreak = S.Schema.Type<typeof LineBreak>;

export const Paragraph = Element.pipe(
  S.extend(
    S.struct({
      type: S.literal("paragraph"),
      children: S.array(S.union(Text, LineBreak)),
    }),
  ),
);
export type Paragraph = S.Schema.Type<typeof Paragraph>;

export const Root = Element.pipe(
  S.extend(
    S.struct({
      type: S.literal("root"),
      // It's mutable in Lexical, so it must be here as well.
      // The array must be non-empty. Lexical can work with empty,
      // but when a text is pasted, it fails with some error.
      children: S.mutable(S.nonEmptyArray(Paragraph)),
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
export const Content = S.struct({
  _tag: S.literal("Content"),
  version: S.literal(1),
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
  S.extend(S.struct({ _tag: S.literal("ContentMax10k") })),
  S.filter((a) => JSON.stringify(a).length <= 10000, {
    message: () => "JSON.stringify(a).length > 10000",
  }),
);
export type ContentMax10k = S.Schema.Type<typeof ContentMax10k>;

export const ContentMax10kFromContent = S.transform(
  Content,
  ContentMax10k,
  (a) => ({ ...a, _tag: "ContentMax10k" as const }),
  (a) => ({ ...a, _tag: "Content" as const }),
);

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
