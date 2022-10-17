import { createHooks, model, NonEmptyString1000 } from "evolu";

export const EvoluId = model.id<"evolu">();
export type EvoluId = model.infer<typeof EvoluId>;

export const { useQuery, useMutation } = createHooks({
  evolu: {
    id: EvoluId,
    title: NonEmptyString1000,
  },
});
