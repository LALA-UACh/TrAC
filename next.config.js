const withPlugins = require("next-compose-plugins");
const withCSS = require("@zeit/next-css");
const withSass = require("@zeit/next-sass");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = withPlugins([[withCSS], [withSass]], {
  webpack: (config, options) => {
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    return config;
  },
});
