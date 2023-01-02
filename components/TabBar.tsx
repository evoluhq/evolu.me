import { useRouter } from "next/router";
import { useState } from "react";
import { useIntl } from "react-intl";
import { AddModal } from "./AddModal";
import { Button } from "./Button";
import { Link } from "./Link";
import { View } from "./styled";
import { Text } from "./Text";

export const TabBar = () => {
  const intl = useIntl();
  const router = useRouter();
  // const ids = useLocationHashNodeIds();
  // const addHref = pipe(useLocationHashNodeIds(), nodeIdsToLocationHash, (s) =>
  //   s.length ? `/add#${s}` : "/add"

  const [modal, setModal] = useState<"add" | "search" | null>(null);

  const renderModal = (): JSX.Element | null => {
    switch (modal) {
      case "add":
        return <AddModal onRequestClose={() => setModal(null)} />;
      case "search":
        return null;
      case null:
        return null;
    }
  };

  return (
    <View className="flex-row">
      {renderModal()}
      <Link href={"/"}>
        <Text
          as="link"
          p
          transparent={router.asPath !== "/"}
          className="my-1 flex-1 px-0 py-1 text-center"
        >
          {intl.formatMessage({ defaultMessage: "All", id: "zQvVDJ" })}
        </Text>
      </Link>
      <Button className="flex-1" onPress={() => setModal("add")}>
        <Text as="button" transparent>
          {intl.formatMessage({ defaultMessage: "Add", id: "2/2yg+" })}
        </Text>
      </Button>
      <Button className="flex-1">
        <Text as="button" transparent>
          {intl.formatMessage({ defaultMessage: "Search", id: "xmcVZ0" })}
        </Text>
      </Button>
    </View>
  );
};
