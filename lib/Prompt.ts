import * as S from "@effect/schema/Schema";
import { formatError } from "@effect/schema/TreeFormatter";

export const prompt = <From extends string, To>(
  schema: S.Schema<To, From, never>,
  message: string,
  onSuccess: (value: To) => void,
): void => {
  const value = window.prompt(message);
  if (value == null) return; // on cancel
  const a = S.decodeUnknownEither(schema)(value);
  if (a._tag === "Left") {
    alert(formatError(a.left));
    return;
  }
  onSuccess(a.right);
};
