import { createTheme } from "@stylexjs/stylex";
import { baseline, spacing } from "./Tokens.stylex";

export const appSpacing = createTheme(spacing, {
  xxxs: `calc(0.25 * ${baseline.app})`,
  xxs: `calc(0.5 * ${baseline.app})`,
  xs: `calc(0.75 * ${baseline.app})`,
  s: baseline.app,
  m: `calc(1.5 * ${baseline.app})`,
  l: `calc(2 * ${baseline.app})`,
  xl: `calc(3 * ${baseline.app})`,
  xxl: `calc(4 * ${baseline.app})`,
  xxxl: `calc(6 * ${baseline.app})`,
});

/* @link https://utopia.fyi/space/calculator?c=320,16,1.2,1240,18,1.333,5,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12 */
export const webSpacing = createTheme(spacing, {
  xxxs: "clamp(0.25rem, 0.2283rem + 0.1087vw, 0.3125rem)",
  xxs: "clamp(0.5rem, 0.4783rem + 0.1087vw, 0.5625rem)",
  xs: "clamp(0.75rem, 0.7065rem + 0.2174vw, 0.875rem)",
  s: "clamp(1rem, 0.9565rem + 0.2174vw, 1.125rem)",
  m: "clamp(1.5rem, 1.4348rem + 0.3261vw, 1.6875rem)",
  l: "clamp(2rem, 1.913rem + 0.4348vw, 2.25rem)",
  xl: "clamp(3rem, 2.8696rem + 0.6522vw, 3.375rem)",
  xxl: "clamp(4rem, 3.8261rem + 0.8696vw, 4.5rem)",
  xxxl: "clamp(6rem, 5.7391rem + 1.3043vw, 6.75rem)",
});
