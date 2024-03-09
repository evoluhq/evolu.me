import { defineVars } from "@stylexjs/stylex";

/**
 * TODO: https://github.com/trys/utopia-core
 *
 * Btw, 320 is relevant because iPad apps in split view (including Safari) can
 * be 320 points wide.
 *
 * TODO: Maybe soon in StyleX
 * https://twitter.com/naman34/status/1747738611850813639
 */

/* @link https://utopia.fyi/type/calculator/?c=320,16,1.2,1240,18,1.25,5,2,&s=0.75|0.5|0.25,1.5|2|3|4|6,s-l&g=s,l,xl,12 */
export const fontSizes = defineVars({
  step_2: "clamp(0.6944rem, 0.6855rem + 0.0446vw, 0.72rem)",
  step_1: "clamp(0.8331rem, 0.8099rem + 0.1163vw, 0.9rem)",
  step0: "clamp(1rem, 0.9565rem + 0.2174vw, 1.125rem)",
  step1: "clamp(1.2rem, 1.1283rem + 0.3587vw, 1.4063rem)",
  step2: "clamp(1.44rem, 1.3293rem + 0.5533vw, 1.7581rem)",
  step3: "clamp(1.7281rem, 1.5649rem + 0.8163vw, 2.1975rem)",
  step4: "clamp(2.0738rem, 1.8396rem + 1.1707vw, 2.7469rem)",
  step5: "clamp(2.4881rem, 2.1594rem + 1.6435vw, 3.4331rem)",
});

// Vars for appSpacing and webSpacing themes.
export const spacing = defineVars({
  /** 1/4 */
  xxxs: "1rem",
  /** 1/2 */
  xxs: "1rem",
  /** 3/4 */
  xs: "1rem",
  /** 1 */
  s: "1rem",
  /** 1.5 */
  m: "1rem",
  /** 2 */
  l: "1rem",
  /** 3 */
  xl: "1rem",
  /** 4 */
  xxl: "1rem",
  /** 6 */
  xxxl: "1rem",
});

export const fonts = defineVars({
  sans: "system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif",
  serif: "ui-serif,serif",
  mono: "Dank Mono,Operator Mono,Inconsolata,Fira Mono,ui-monospace,SF Mono,Monaco,Droid Sans Mono,Source Code Pro,monospace",
});

const DARK = "@media (prefers-color-scheme: dark)";

export const colors = defineVars({
  primary: { default: "#191919", [DARK]: "#f1f3f5" },
  secondary: { default: "#868e96", [DARK]: "#868e96" },
  border: { default: "#ced4da", [DARK]: "#212529" },
  borderLighter: { default: "#dee2e6", [DARK]: "#212529" },
  background: { default: "#f8f9fa", [DARK]: "#191919" },
  hoverAndFocusBackground: { default: "#dee2e6", [DARK]: "#262626" },
});

// https://github.com/facebook/stylex/issues/250#issuecomment-1868392679
export const atDistance = defineVars({
  buttonBackgroundColor: "transparent",
});

export const consts = defineVars({
  /** "As a general rule, a button needs a hit region of at least 44x44 pt" Apple */
  minimalHit: "44px",
  maxWidth: "38rem",
  maxWidthSmaller: "30rem",
});

export const baseline = defineVars({
  web: `calc(1.5 * ${fontSizes.step0})`,
  /**
   * The baseline based on minimal hit region, hence, not fluid. For the better
   * rhythm granularity, we use half of it.
   */
  app: `calc(${consts.minimalHit} / 2)`,
});

export const transitions = defineVars({
  color:
    "color 0.15s ease, background-color 0.15s ease, outline-color 0.15s ease, border-color 0.15s ease",
});

// https://github.com/facebook/stylex/blob/main/packages/open-props/src/shadows.stylex.js
const shadowStrength = "1%";
const shadowColor = "220 3% 15%";
const shadowStrengthDark = "25%";
const shadowColorDark = "220 40% 2%";
const innerShadowHighlight = "inset 0 -.5px 0 0 #fff2, inset 0 .5px 0 0 #0007";

export const shadows = defineVars({
  shadow1: {
    default: `0 1px 2px -1px hsl(${shadowColor} / calc(${shadowStrength} + 9%))`,
    [DARK]: `0 1px 2px -1px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 9%))`,
  },
  shadow2: {
    default: `
    0 3px 5px -2px hsl(${shadowColor} / calc(${shadowStrength} + 3%)),
    0 7px 14px -5px hsl(${shadowColor} / calc(${shadowStrength} + 5%))`,
    [DARK]: `
    0 3px 5px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 3%)),
    0 7px 14px -5px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 5%))`,
  },
  shadow3: {
    default: `
      0 -1px 3px 0 hsl(${shadowColor} / calc(${shadowStrength} + 2%)),
      0 1px 2px -5px hsl(${shadowColor} / calc(${shadowStrength} + 2%)),
      0 2px 5px -5px hsl(${shadowColor} / calc(${shadowStrength} + 4%)),
      0 4px 12px -5px hsl(${shadowColor} / calc(${shadowStrength} + 5%)),
      0 12px 15px -5px hsl(${shadowColor} / calc(${shadowStrength} + 7%))`,
    [DARK]: `
    0 -1px 3px 0 hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 2%)),
    0 1px 2px -5px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 2%)),
    0 2px 5px -5px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 4%)),
    0 4px 12px -5px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 5%)),
    0 12px 15px -5px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 7%))`,
  },
  shadow4: {
    default: `
      0 -2px 5px 0 hsl(${shadowColor} / calc(${shadowStrength} + 2%)),
      0 1px 1px -2px hsl(${shadowColor} / calc(${shadowStrength} + 3%)),
      0 2px 2px -2px hsl(${shadowColor} / calc(${shadowStrength} + 3%)),
      0 5px 5px -2px hsl(${shadowColor} / calc(${shadowStrength} + 4%)),
      0 9px 9px -2px hsl(${shadowColor} / calc(${shadowStrength} + 5%)),
      0 16px 16px -2px hsl(${shadowColor} / calc(${shadowStrength} + 6%))`,
    [DARK]: `
    0 -2px 5px 0 hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 2%)),
    0 1px 1px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 3%)),
    0 2px 2px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 3%)),
    0 5px 5px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 4%)),
    0 9px 9px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 5%)),
    0 16px 16px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 6%))`,
  },
  shadow5: {
    default: `
      0 -1px 2px 0 hsl(${shadowColor} / calc(${shadowStrength} + 2%)),
      0 2px 1px -2px hsl(${shadowColor} / calc(${shadowStrength} + 3%)),
      0 5px 5px -2px hsl(${shadowColor} / calc(${shadowStrength} + 3%)),
      0 10px 10px -2px hsl(${shadowColor} / calc(${shadowStrength} + 4%)),
      0 20px 20px -2px hsl(${shadowColor} / calc(${shadowStrength} + 5%)),
      0 40px 40px -2px hsl(${shadowColor} / calc(${shadowStrength} + 7%))`,
    [DARK]: `
    0 -1px 2px 0 hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 2%)),
    0 2px 1px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 3%)),
    0 5px 5px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 3%)),
    0 10px 10px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 4%)),
    0 20px 20px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 5%)),
    0 40px 40px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 7%))`,
  },
  shadow6: {
    default: `
      0 -1px 2px 0 hsl(${shadowColor} / calc(${shadowStrength} + 2%)),
      0 3px 2px -2px hsl(${shadowColor} / calc(${shadowStrength} + 3%)),
      0 7px 5px -2px hsl(${shadowColor} / calc(${shadowStrength} + 3%)),
      0 12px 10px -2px hsl(${shadowColor} / calc(${shadowStrength} + 4%)),
      0 22px 18px -2px hsl(${shadowColor} / calc(${shadowStrength} + 5%)),
      0 41px 33px -2px hsl(${shadowColor} / calc(${shadowStrength} + 6%)),
      0 100px 80px -2px hsl(${shadowColor} / calc(${shadowStrength} + 7%))`,
    [DARK]: `
      0 -1px 2px 0 hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 2%)),
      0 3px 2px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 3%)),
      0 7px 5px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 3%)),
      0 12px 10px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 4%)),
      0 22px 18px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 5%)),
      0 41px 33px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 6%)),
      0 100px 80px -2px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 7%))`,
  },

  innerShadow0: {
    default: `inset 0 0 0 1px hsl(${shadowColor} / calc(${shadowStrength} + 9%))`,
    [DARK]: `inset 0 0 0 1px hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 9%))`,
  },
  innerShadow1: {
    default: `inset 0 1px 2px 0 hsl(${shadowColor} / calc(${shadowStrength} + 9%)), ${innerShadowHighlight}`,
    [DARK]: `inset 0 1px 2px 0 hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 9%)), ${innerShadowHighlight}`,
  },
  innerShadow2: {
    default: `inset 0 1px 4px 0 hsl(${shadowColor} / calc(${shadowStrength} + 9%)), ${innerShadowHighlight}`,
    [DARK]: `inset 0 1px 4px 0 hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 9%)), ${innerShadowHighlight}`,
  },
  innerShadow3: {
    default: `inset 0 2px 8px 0 hsl(${shadowColor} / calc(${shadowStrength} + 9%)), ${innerShadowHighlight}`,
    [DARK]: `inset 0 2px 8px 0 hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 9%)), ${innerShadowHighlight}`,
  },
  innerShadow4: {
    default: `inset 0 2px 14px 0 hsl(${shadowColor} / calc(${shadowStrength} + 9%)), ${innerShadowHighlight}`,
    [DARK]: `inset 0 2px 14px 0 hsl(${shadowColorDark} / calc(${shadowStrengthDark} + 9%)), ${innerShadowHighlight}`,
  },
});

// https://github.com/facebook/stylex/blob/main/packages/open-props/src/colors.stylex.js
export const openPropsColors = defineVars({
  gray0: "#f8f9fa",
  gray1: "#f1f3f5",
  gray2: "#e9ecef",
  gray3: "#dee2e6",
  gray4: "#ced4da",
  gray5: "#adb5bd",
  gray6: "#868e96",
  gray7: "#495057",
  gray8: "#343a40",
  gray9: "#212529",
  gray10: "#16191d",
  gray11: "#0d0f12",
  gray12: "#030507",
  stone0: "#f8fafb",
  stone1: "#f2f4f6",
  stone2: "#ebedef",
  stone3: "#e0e4e5",
  stone4: "#d1d6d8",
  stone5: "#b1b6b9",
  stone6: "#979b9d",
  stone7: "#7e8282",
  stone8: "#666968",
  stone9: "#50514f",
  stone10: "#3a3a37",
  stone11: "#252521",
  stone12: "#121210",
  red0: "#fff5f5",
  red1: "#ffe3e3",
  red2: "#ffc9c9",
  red3: "#ffa8a8",
  red4: "#ff8787",
  red5: "#ff6b6b",
  red6: "#fa5252",
  red7: "#f03e3e",
  red8: "#e03131",
  red9: "#c92a2a",
  red10: "#b02525",
  red11: "#962020",
  red12: "#7d1a1a",
  pink0: "#fff0f6",
  pink1: "#ffdeeb",
  pink2: "#fcc2d7",
  pink3: "#faa2c1",
  pink4: "#f783ac",
  pink5: "#f06595",
  pink6: "#e64980",
  pink7: "#d6336c",
  pink8: "#c2255c",
  pink9: "#a61e4d",
  pink10: "#8c1941",
  pink11: "#731536",
  pink12: "#59102a",
  purple0: "#f8f0fc",
  purple1: "#f3d9fa",
  purple2: "#eebefa",
  purple3: "#e599f7",
  purple4: "#da77f2",
  purple5: "#cc5de8",
  purple6: "#be4bdb",
  purple7: "#ae3ec9",
  purple8: "#9c36b5",
  purple9: "#862e9c",
  purple10: "#702682",
  purple11: "#5a1e69",
  purple12: "#44174f",
  violet0: "#f3f0ff",
  violet1: "#e5dbff",
  violet2: "#d0bfff",
  violet3: "#b197fc",
  violet4: "#9775fa",
  violet5: "#845ef7",
  violet6: "#7950f2",
  violet7: "#7048e8",
  violet8: "#6741d9",
  violet9: "#5f3dc4",
  violet10: "#5235ab",
  violet11: "#462d91",
  violet12: "#3a2578",
  indigo0: "#edf2ff",
  indigo1: "#dbe4ff",
  indigo2: "#bac8ff",
  indigo3: "#91a7ff",
  indigo4: "#748ffc",
  indigo5: "#5c7cfa",
  indigo6: "#4c6ef5",
  indigo7: "#4263eb",
  indigo8: "#3b5bdb",
  indigo9: "#364fc7",
  indigo10: "#2f44ad",
  indigo11: "#283a94",
  indigo12: "#21307a",
  blue0: "#e7f5ff",
  blue1: "#d0ebff",
  blue2: "#a5d8ff",
  blue3: "#74c0fc",
  blue4: "#4dabf7",
  blue5: "#339af0",
  blue6: "#228be6",
  blue7: "#1c7ed6",
  blue8: "#1971c2",
  blue9: "#1864ab",
  blue10: "#145591",
  blue11: "#114678",
  blue12: "#0d375e",
  cyan0: "#e3fafc",
  cyan1: "#c5f6fa",
  cyan2: "#99e9f2",
  cyan3: "#66d9e8",
  cyan4: "#3bc9db",
  cyan5: "#22b8cf",
  cyan6: "#15aabf",
  cyan7: "#1098ad",
  cyan8: "#0c8599",
  cyan9: "#0b7285",
  cyan10: "#095c6b",
  cyan11: "#074652",
  cyan12: "#053038",
  teal0: "#e6fcf5",
  teal1: "#c3fae8",
  teal2: "#96f2d7",
  teal3: "#63e6be",
  teal4: "#38d9a9",
  teal5: "#20c997",
  teal6: "#12b886",
  teal7: "#0ca678",
  teal8: "#099268",
  teal9: "#087f5b",
  teal10: "#066649",
  teal11: "#054d37",
  teal12: "#033325",
  green0: "#ebfbee",
  green1: "#d3f9d8",
  green2: "#b2f2bb",
  green3: "#8ce99a",
  green4: "#69db7c",
  green5: "#51cf66",
  green6: "#40c057",
  green7: "#37b24d",
  green8: "#2f9e44",
  green9: "#2b8a3e",
  green10: "#237032",
  green11: "#1b5727",
  green12: "#133d1b",
  lime0: "#f4fce3",
  lime1: "#e9fac8",
  lime2: "#d8f5a2",
  lime3: "#c0eb75",
  lime4: "#a9e34b",
  lime5: "#94d82d",
  lime6: "#82c91e",
  lime7: "#74b816",
  lime8: "#66a80f",
  lime9: "#5c940d",
  lime10: "#4c7a0b",
  lime11: "#3c6109",
  lime12: "#2c4706",
  yellow0: "#fff9db",
  yellow1: "#fff3bf",
  yellow2: "#ffec99",
  yellow3: "#ffe066",
  yellow4: "#ffd43b",
  yellow5: "#fcc419",
  yellow6: "#fab005",
  yellow7: "#f59f00",
  yellow8: "#f08c00",
  yellow9: "#e67700",
  yellow10: "#b35c00",
  yellow11: "#804200",
  yellow12: "#663500",
  orange0: "#fff4e6",
  orange1: "#ffe8cc",
  orange2: "#ffd8a8",
  orange3: "#ffc078",
  orange4: "#ffa94d",
  orange5: "#ff922b",
  orange6: "#fd7e14",
  orange7: "#f76707",
  orange8: "#e8590c",
  orange9: "#d9480f",
  orange10: "#bf400d",
  orange11: "#99330b",
  orange12: "#802b09",
  choco0: "#fff8dc",
  choco1: "#fce1bc",
  choco2: "#f7ca9e",
  choco3: "#f1b280",
  choco4: "#e99b62",
  choco5: "#df8545",
  choco6: "#d46e25",
  choco7: "#bd5f1b",
  choco8: "#a45117",
  choco9: "#8a4513",
  choco10: "#703a13",
  choco11: "#572f12",
  choco12: "#3d210d",
  brown0: "#faf4eb",
  brown1: "#ede0d1",
  brown2: "#e0cab7",
  brown3: "#d3b79e",
  brown4: "#c5a285",
  brown5: "#b78f6d",
  brown6: "#a87c56",
  brown7: "#956b47",
  brown8: "#825b3a",
  brown9: "#6f4b2d",
  brown10: "#5e3a21",
  brown11: "#4e2b15",
  brown12: "#422412",
  sand0: "#f8fafb",
  sand1: "#e6e4dc",
  sand2: "#d5cfbd",
  sand3: "#c2b9a0",
  sand4: "#aea58c",
  sand5: "#9a9178",
  sand6: "#867c65",
  sand7: "#736a53",
  sand8: "#5f5746",
  sand9: "#4b4639",
  sand10: "#38352d",
  sand11: "#252521",
  sand12: "#121210",
  camo0: "#f9fbe7",
  camo1: "#e8ed9c",
  camo2: "#d2df4e",
  camo3: "#c2ce34",
  camo4: "#b5bb2e",
  camo5: "#a7a827",
  camo6: "#999621",
  camo7: "#8c851c",
  camo8: "#7e7416",
  camo9: "#6d6414",
  camo10: "#5d5411",
  camo11: "#4d460e",
  camo12: "#36300a",
  jungle0: "#ecfeb0",
  jungle1: "#def39a",
  jungle2: "#d0e884",
  jungle3: "#c2dd6e",
  jungle4: "#b5d15b",
  jungle5: "#a8c648",
  jungle6: "#9bbb36",
  jungle7: "#8fb024",
  jungle8: "#84a513",
  jungle9: "#7a9908",
  jungle10: "#658006",
  jungle11: "#516605",
  jungle12: "#3d4d04",
});
