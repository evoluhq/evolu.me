import * as S from "@effect/schema/Schema";
import { Option } from "effect";
import Error from "next/error";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useMemo, useState } from "react";

/**
 * Typed routing for Next.js Pages Router.
 * https://nextjs.org/docs/pages/api-reference/functions/use-router#router-object
 */
export const RouterQuery = <From, To>({
  schema,
  render,
}: {
  schema: S.Schema<To, From, never>;
  render: (query: To) => ReactNode;
}) => {
  const router = useRouter();
  const [query, setQuery] = useState<null | Option.Option<To>>(null);

  useEffect(() => {
    if (!router.isReady) return;
    setQuery(S.decodeUnknownOption(schema)(router.query));
  }, [router.isReady, router.query, schema]);

  return useMemo(
    () =>
      query &&
      Option.match(query, {
        onNone: () => <Error statusCode={404} />,
        onSome: render,
      }),
    [query, render],
  );
};
