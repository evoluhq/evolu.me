import { create, props } from "@stylexjs/stylex";
import { FC, ReactNode } from "react";
import { consts } from "../lib/Tokens.stylex";

export const WeekGrid: FC<{
  children: ReactNode;
  forMonth?: boolean;
}> = ({ children, forMonth }) => {
  return (
    <div {...props([styles.weekGrid, forMonth && styles.forMonth])}>
      {children}
    </div>
  );
};

const styles = create({
  weekGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
  },
  /**
   * Some months (e.g. September 2024) can have six lines, and this style is a
   * clever workaround to avoid content shifts, the similar as iOS does. iOS
   * also moves overflowed content up a little bit.
   */
  forMonth: {
    height: `calc(5 * ${consts.minimalHit})`,
    overflow: "hidden", // Prevent scrolling.
  },
});
