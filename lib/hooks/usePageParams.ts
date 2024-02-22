// import * as S from "@effect/schema/Schema";
// import { Either } from "effect";
// import { Simplify } from "effect/Types";
// import { notFound } from "next/navigation";

// /** For Next.js App Router. */
// export const usePageParams = <Fields extends S.StructFields>(
//   params: unknown,
//   fields: Fields,
// ): Simplify<S.ToStruct<Fields>> =>
//   S.decodeUnknownEither(S.struct(fields))(params).pipe(Either.getOrElse(notFound));
