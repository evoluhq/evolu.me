import {
  NonEmptyString1000,
  parseMnemonic,
  useEvolu,
  useOwner,
} from "@evolu/react";
import { create } from "@stylexjs/stylex";
import { Effect, Exit } from "effect";
import { useState } from "react";
import { Button } from "../../components/Button";
import { PageWithTitle } from "../../components/PageWithTitle";
import { Text } from "../../components/Text";
import { prompt } from "../../lib/Prompt";
import { fonts } from "../../lib/Tokens.stylex";

export default function Settings() {
  const owner = useOwner();
  const evolu = useEvolu();

  const [showMnemonic, setShowMnemonic] = useState(false);

  const handleShowMnemonicPress = () => {
    setShowMnemonic(!showMnemonic);
  };

  const handleRestoreOwnerPress = () => {
    prompt(NonEmptyString1000, "Your Mnemonic", (mnemonic) => {
      void parseMnemonic(mnemonic)
        .pipe(Effect.runPromiseExit)
        .then(
          Exit.match({
            onFailure: (error) => {
              alert(JSON.stringify(error, null, 2));
            },
            onSuccess: (mnemonic) => {
              evolu.restoreOwner(mnemonic);
            },
          }),
        );
    });
  };

  const handleResetOwnerPress = () => {
    if (confirm("Are you sure? It will delete all your local data."))
      evolu.resetOwner();
  };

  return (
    <PageWithTitle title="Settings">
      <Button
        variant="webBig"
        title={showMnemonic ? "Hide Mnemonic" : "Show Mnemonic"}
        onPress={handleShowMnemonicPress}
      />
      {showMnemonic && owner && (
        <Text tag="p" style={styles.mnemonic}>
          {owner.mnemonic}
        </Text>
      )}
      <Button
        variant="webBig"
        title="Restore Owner"
        onPress={handleRestoreOwnerPress}
      />
      <Button
        variant="webBig"
        title="Reset Owner"
        onPress={handleResetOwnerPress}
      />
    </PageWithTitle>
  );
}

const styles = create({
  mnemonic: {
    textWrap: "balance",
    textAlign: "center",
    fontFamily: fonts.mono,
  },
});
