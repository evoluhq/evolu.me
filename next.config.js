const stylexPlugin = require("@stylexjs/nextjs-plugin");
const babelrc = require("./.babelrc.js");

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // For some reason, transpile react-native isn't required with App Router.
  transpilePackages: ["react-native"],
  experimental: {
    optimizePackageImports: ["effect"],
    // Can't use because: https://github.com/kysely-org/kysely/issues/751
    // Also, StyleX is Webpack only.
    // turbo: {
    //   resolveAlias: {
    //     "react-native": "react-native-web",
    //   },
    // },
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      "react-native$": "react-native-web",
    };
    return config;
  },
};

// From https://github.com/facebook/stylex/blob/main/apps/nextjs-example/next.config.js
const plugins = babelrc.plugins;
const [_name, options] = plugins.find(
  (plugin) => Array.isArray(plugin) && plugin[0] === "@stylexjs/babel-plugin",
);
const rootDir = options.unstable_moduleResolution.rootDir ?? __dirname;

module.exports = stylexPlugin({
  rootDir,
  // when `true`, Stylex can't override RNfW styles for some reasone.
  useCSSLayers: false,
})(nextConfig);
