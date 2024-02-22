import { create } from "@stylexjs/stylex";
import { baseline, colors } from "./Tokens.stylex";

const styles = create({
  baseline: {
    backgroundImage: `linear-gradient(to bottom, ${colors.hoverAndFocusBackground} 0, transparent 1px)`,
    backgroundRepeat: "repeat-y",
  },
  /**
   * Traditional, not typographic baseline rhythm. We have to wait for
   * text-box-trim. https://github.com/jantimon/text-box-trim-examples
   *
   * This is not accurate:
   * https://twitter.com/naman34/status/1754037582441455800
   */
  webBaseline: {
    backgroundSize: `100% ${baseline.web}`,
  },
  /** Typographic baseline rhythm optimized for minimal hit. */
  appBaseline: {
    /**
     * Note Safari has a weird rounding bug for fluid line height so that this
     * grid can be slightly off for specific screen widths. It's nothing a user
     * can spot on; only this grid can be misleading sometimes.
     */
    backgroundSize: `100% calc(${baseline.app} / 2)`,
    /**
     * Simulate typographic baseline (a baseline aligned directly under a text).
     * Remember, such a feature is only partially possible without capsize.js
     * because we can use an align-items baseline consistently for only one font
     * size (fontSizes.step0 and smaller). We don't want to use capsize.js
     * because we prefer system fonts.
     *
     * This magic constant depends on the actual system font.
     */
    backgroundPositionY: 6.5,
  },
});

export const devBaseline = (isApp: boolean) => [
  styles.baseline,
  isApp ? styles.appBaseline : styles.webBaseline,
];
