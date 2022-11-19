import { createHooks, model, String1000 } from "evolu";
import { Eq, eqStrict } from "fp-ts/Eq";

// config.log = true;

export const EvoluId = model.id<"evolu">();
export type EvoluId = model.infer<typeof EvoluId>;
export const eqEvoluId: Eq<EvoluId> = eqStrict;

export const EvoluEdgeId = model.id<"evoluEdge">();
export type EvoluEdgeId = model.infer<typeof EvoluEdgeId>;

export const { useQuery, useMutation } = createHooks({
  evolu: {
    id: EvoluId,
    title: String1000,
  },
  // undirected graph
  evoluEdge: {
    id: EvoluEdgeId,
    a: EvoluId,
    b: EvoluId,
  },
});
