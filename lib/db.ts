import { createHooks, model, NonEmptyString1000 } from "evolu";
import { Eq, eqStrict } from "fp-ts/Eq";

// config.log = true;

export const NodeId = model.id<"Node">();
export type NodeId = model.infer<typeof NodeId>;
export const eqNodeId: Eq<NodeId> = eqStrict;

export const EdgeId = model.id<"Edge">();
export type EdgeId = model.infer<typeof EdgeId>;

export const { useQuery, useMutation } = createHooks({
  node: {
    id: NodeId,
    title: NonEmptyString1000,
  },
  // undirected graph
  edge: {
    id: EdgeId,
    a: NodeId,
    b: NodeId,
  },
});
