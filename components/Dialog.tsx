import { StyleXStyles, create, props } from "@stylexjs/stylex";
import { FC, ReactNode } from "react";
import { Pressable, ScrollView } from "react-native";
import { colors, consts, shadows, spacing } from "../lib/Tokens.stylex";
import { RNfW } from "../lib/Types";
import { devBaseline } from "../lib/devBaseline";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { Hr } from "./Hr";

export const Dialog: FC<{
  children: ReactNode;
  onRequestClose: () => void;
  onCancel: () => void;
  onDone: () => void;
  containerStyle?: StyleXStyles;
}> = ({ children, onRequestClose, onCancel, onDone, containerStyle }) => {
  return (
    <Modal onRequestClose={onRequestClose} background>
      <ScrollView
        style={styles.scrollView as RNfW}
        centerContent
        contentContainerStyle={styles.contentContainer as RNfW}
      >
        <div
          {...props([
            styles.container,
            containerStyle,
            false && devBaseline(true),
          ])}
        >
          {children}
          <Hr />
          <div {...props(styles.footer)}>
            <Button variant="app" title="Cancel" onPress={onCancel} />
            <Button variant="app" title="Done" onPress={onDone} />
          </div>
        </div>
        {/* It must not be the first because of Modal auto-focus. */}
        <Pressable
          // @ts-expect-error RNfW
          tabIndex={-1}
          style={styles.pressableBackground as RNfW}
          onPress={onRequestClose}
        />
      </ScrollView>
    </Modal>
  );
};

const styles = create({
  scrollView: {
    height: "100%",
  },
  contentContainer: {
    padding: spacing.xs,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: consts.maxWidthSmaller,
    marginInline: "auto",
    paddingInline: spacing.xs,
    paddingBlock: spacing.xxs,
    backgroundColor: colors.background,
    borderRadius: spacing.xxxs,
    boxShadow: `0 0 0 1px ${colors.borderLighter}, ${shadows.shadow3}`,
  },
  pressableBackground: {
    position: "fixed",
    cursor: "default",
    inset: 0,
    zIndex: -1,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
});
