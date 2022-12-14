import { getOwner, resetOwner, restoreOwner } from "evolu";
import { pipe } from "fp-ts/function";
import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Button, ButtonProps } from "../components/Button";
import { Dialog } from "../components/Dialog";
import { Layout } from "../components/Layout";
import { View } from "../components/styled";
import { Text } from "../components/Text";
import { useQuery } from "../lib/db";
import { clearAllLocalStorageEvoluMeKeys } from "../lib/localStorage";

const RoundedButtonWithDescription: FC<
  ButtonProps & { title: string; description: string }
> = ({ title, description, ...props }) => {
  return (
    <View className="mt-3">
      <View className="flex-row">
        <Button {...props}>
          <Text as="roundedButton">{title}</Text>
        </Button>
      </View>
      <Text size="sm" mb p>
        {description}
      </Text>
    </View>
  );
};

const DownloadLink = () => {
  const intl = useIntl();
  const { rows, isLoaded } = useQuery((db) =>
    // TODO: Add all tables.
    db.selectFrom("node").selectAll().orderBy("createdAt")
  );
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    pipe(
      JSON.stringify(rows),
      (json) => new Blob([json], { type: "application/json" }),
      (blob) => URL.createObjectURL(blob),
      setUrl
    );
  }, [isLoaded, rows]);

  const fileName = intl.formatMessage({
    defaultMessage: "backup.json",
    id: "y1unJo",
  });

  return (
    <Text mb>
      {!url ? (
        intl.formatMessage({ defaultMessage: "Preparingâ€¦", id: "Ob8gKI" })
      ) : (
        <Text
          // @ts-expect-errors RNfW
          href={url}
          hrefAttrs={{ target: "blank", download: fileName }}
          className="rounded underline focus:outline-none focus-visible:ring-2"
        >
          {fileName}
        </Text>
      )}
    </Text>
  );
};

const Settings = () => {
  const intl = useIntl();
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [download, setDownload] = useState(false);

  return (
    <Layout
      title={intl.formatMessage({ defaultMessage: "Settings", id: "D3idYv" })}
    >
      <RoundedButtonWithDescription
        title={intl.formatMessage({
          defaultMessage: "Show Mnemonic",
          id: "/Kjmsc",
        })}
        description={intl.formatMessage({
          defaultMessage:
            "A Mnemonic is a strong and human-readable password generated by your device.",
          id: "GteWll",
        })}
        onPress={() => {
          getOwner().then((owner) => {
            setMnemonic(mnemonic == null ? owner.mnemonic : null);
          });
        }}
      />
      {mnemonic && (
        <Dialog
          title={intl.formatMessage({
            defaultMessage: "Your Mnemonic",
            id: "mwh5gw",
          })}
          onRequestClose={() => setMnemonic(null)}
        >
          <Text mb>{mnemonic}</Text>
        </Dialog>
      )}
      <RoundedButtonWithDescription
        title={intl.formatMessage({
          defaultMessage: "Restore Data",
          id: "fmvzdQ",
        })}
        description={intl.formatMessage({
          defaultMessage:
            "Open this page on a different device and use your mnemonic to restore your data.",
          id: "6RggLU",
        })}
        onPress={() => {
          const mnemonic = prompt(
            intl.formatMessage({
              defaultMessage: "Your Mnemonic",
              id: "mwh5gw",
            })
          );
          if (mnemonic == null) return;
          clearAllLocalStorageEvoluMeKeys();
          const either = restoreOwner(mnemonic);
          if (either._tag === "Left")
            alert(JSON.stringify(either.left, null, 2));
        }}
      />
      <RoundedButtonWithDescription
        title={intl.formatMessage({
          defaultMessage: "Download Data",
          id: "5jKtTm",
        })}
        description={intl.formatMessage({
          defaultMessage: "Download your data as JSON.",
          id: "bAR4Hi",
        })}
        onPress={() => {
          setDownload(true);
        }}
      />
      {download && (
        <Dialog
          title={intl.formatMessage({
            defaultMessage: "Your Data",
            id: "jqRQnw",
          })}
          onRequestClose={() => setDownload(false)}
        >
          <DownloadLink />
        </Dialog>
      )}
      <RoundedButtonWithDescription
        title={intl.formatMessage({
          defaultMessage: "Delete Data",
          id: "u0BHMY",
        })}
        description={intl.formatMessage({
          defaultMessage: "Delete all your data from this device.",
          id: "B7tjpq",
        })}
        onPress={() => {
          if (
            confirm(
              intl.formatMessage({
                defaultMessage:
                  "Are you sure? It will delete all your local data.",
                id: "gUiimf",
              })
            )
          ) {
            clearAllLocalStorageEvoluMeKeys();
            resetOwner();
          }
        }}
      />
    </Layout>
  );
};

export default Settings;
