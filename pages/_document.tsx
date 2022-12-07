import Document, { Head, Html, Main, NextScript } from "next/document";
import { Children } from "react";
import { AppRegistry } from "react-native";
import config from "../app.json";

export default class MyDocument extends Document {
  // @ts-expect-error RNfW
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent(config.name, () => Main);
    // @ts-expect-error RNfW
    const { getStyleElement } = AppRegistry.getApplication(config.name);
    const page = await renderPage();
    const styles = [getStyleElement()];
    return { ...page, styles: Children.toArray(styles) };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body className="bg-white dark:bg-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
