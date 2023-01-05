import { createHooks, model } from "evolu";
import { Eq, eqStrict } from "fp-ts/Eq";

// config.log = true;

export const NodeId = model.id<"Node">();
export type NodeId = model.infer<typeof NodeId>;
export const eqNodeId: Eq<NodeId> = eqStrict;

export const NodeMarkdown = model
  .string()
  .min(1)
  .max(32768)
  .brand<"NodeMarkdown">();
export type NodeMarkdown = model.infer<typeof NodeMarkdown>;

export const EdgeId = model.id<"Edge">();
export type EdgeId = model.infer<typeof EdgeId>;

export const { useQuery, useMutation } = createHooks({
  node: {
    id: NodeId,
    md: NodeMarkdown,
  },
  // undirected graph
  edge: {
    id: EdgeId,
    a: NodeId,
    b: NodeId,
  },
});

export const createEdge = (
  x: NodeId,
  y: NodeId
): {
  a: NodeId;
  b: NodeId;
} => {
  // Sort IDs to ensure edge direction doesn't matter.
  const sorted = [x, y].sort();
  return { a: sorted[0], b: sorted[1] };
};
