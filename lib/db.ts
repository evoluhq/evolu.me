import { createHooks, model, String1000 } from "evolu";

// config.log = true;

export const EvoluId = model.id<"evolu">();
export type EvoluId = model.infer<typeof EvoluId>;

export const { useQuery, useMutation } = createHooks({
  evolu: {
    id: EvoluId,
    title: String1000,
  },
});
