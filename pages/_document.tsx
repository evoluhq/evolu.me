import { create, props } from "@stylexjs/stylex";
import Document, { Head, Html, Main, NextScript } from "next/document";
import { AppRegistry } from "react-native";
import { colors } from "../lib/Tokens.stylex";

export default class MyDocument extends Document {
  /* eslint-disable */
  static async getInitialProps(ctx: any) {
    const { renderPage } = ctx;
    AppRegistry.registerComponent("evolu.me", () => Main);
    // @ts-expect-error RNfW
    const { getStyleElement } = AppRegistry.getApplication("evolu.me");
    const page = await renderPage();
    const styles = getStyleElement();
    return { ...page, styles };
  }
  /* eslint-enable */

  render() {
    return (
      <Html lang="en">
        <Head />
        <body {...props(styles.body)}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

const styles = create({
  body: {
    backgroundColor: colors.background,
  },
});
