import { createHooks, model } from "evolu";

export const EvoluId = model.id<"evolu">();
export type EvoluId = model.infer<typeof EvoluId>;

export const NonEmptyString140 = model
  .string()
  .min(1)
  .max(140)
  .brand<"NonEmptyString140">();
export type NonEmptyString140 = model.infer<typeof NonEmptyString140>;

export const NonEmptyString10000 = model
  .string()
  .min(1)
  .max(10000)
  .brand<"NonEmptyString10000">();
export type NonEmptyString10000 = model.infer<typeof NonEmptyString10000>;

export const { useQuery, useMutation } = createHooks({
  evolu: {
    id: EvoluId,
    title: NonEmptyString140,
    text: NonEmptyString10000,
  },
});
