import { create, props } from "@stylexjs/stylex";
import { FC } from "react";
import { colors } from "../lib/Tokens.stylex";

export const Hr: FC = () => {
  return (
    <div {...props(styles.div)}>
      <div {...props(styles.hr)} />
    </div>
  );
};

const styles = create({
  div: {
    position: "relative",
  },
  hr: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 1,
    backgroundColor: colors.borderLighter,
  },
});
