import { pipe } from "fp-ts/function";
import { useRouter } from "next/router";
import { FC } from "react";
import { useIntl } from "react-intl";
import { useLocationHashNodeIds } from "../lib/hooks/useLocationHashNodeIds";
import { nodeIdsToLocationHash } from "../lib/nodeIdsToLocationHash";
import { Link } from "./Link";
import { View } from "./styled";
import { Text } from "./Text";

const TabBarLink: FC<{
  href: string;
  text: string;
}> = ({ href, text }) => {
  const router = useRouter();

  return (
    <Link href={href}>
      <Text
        as="link"
        p
        transparent={router.asPath !== href}
        className="my-1 w-1/3 py-1 text-center"
      >
        {text}
      </Text>
    </Link>
  );
};

export const TabBar = () => {
  const intl = useIntl();

  const addHref = pipe(
    useLocationHashNodeIds(),
    nodeIdsToLocationHash,
    (s) => `/add#${s}`
  );

  return (
    <>
      <View className="flex-row">
        <TabBarLink
          href="/"
          text={intl.formatMessage({ defaultMessage: "All", id: "zQvVDJ" })}
        />
        <TabBarLink
          href={addHref}
          text={intl.formatMessage({ defaultMessage: "Add", id: "2/2yg+" })}
        />
        <TabBarLink
          href="/search"
          text={intl.formatMessage({
            defaultMessage: "Search",
            id: "xmcVZ0",
          })}
        />
      </View>
    </>
  );
};
