import Document, { Head, Html, Main, NextScript } from "next/document";
import { Children } from "react";
import { AppRegistry } from "react-native";
import config from "../app.json";

// Force Next-generated DOM elements to fill their parent's height
const normalizeNextElements = `
  #__next {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`;

export default class MyDocument extends Document {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent(config.name, () => Main);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { getStyleElement } = AppRegistry.getApplication(config.name);
    const page = await renderPage();
    const styles = [
      // eslint-disable-next-line react/jsx-key
      <style dangerouslySetInnerHTML={{ __html: normalizeNextElements }} />,
      getStyleElement(),
    ];
    return { ...page, styles: Children.toArray(styles) };
  }

  render() {
    return (
      <Html lang="en" style={{ height: "100%" }}>
        <Head />
        <body className="h-full overflow-hidden bg-white dark:bg-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
