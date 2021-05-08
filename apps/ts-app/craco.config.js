require("@craco/craco");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  babel: {
    presets: [["@babel/preset-react", { runtime: "automatic", importSource: "@emotion/react" }]],
    plugins: ["@emotion"],
    loaderOptions: (babelLoaderOptions, { env, paths }) => {
      return babelLoaderOptions;
    },
  },
  webpack: {
    alias: {},
    plugins: {
      add: [] /* An array of plugins */,
      remove: [] /* An array of plugin constructor's names (i.e. "StyleLintPlugin", "ESLintWebpackPlugin" ) */,
    },
    configure: (webpackConfig, { env, paths }) => {
      // Remove ModuleScopePlugin which prevents importing outside /src folder
      webpackConfig.resolve.plugins.pop();
      // Resolve the path aliases
      webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin());
      // Update tsRule to compile outside /src
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      const tsRule = oneOfRule.oneOf.find((rule) => rule.test.toString().includes("ts|tsx"));
      tsRule.include = undefined;
      tsRule.exclude = /node_modules/;

      return webpackConfig;
    },
  },
  jest: {
    babel: {
      addPresets: true /* (default value) */,
      addPlugins: true /* (default value) */,
    },
    configure: (jestConfig, { env, paths, resolve, rootDir }) => {
      return jestConfig;
    },
  },
  plugins: [
    {
      plugin: {
        overrideCracoConfig: ({ cracoConfig, pluginOptions, context: { env, paths } }) => {
          return cracoConfig;
        },
        overrideWebpackConfig: ({
          webpackConfig,
          cracoConfig,
          pluginOptions,
          context: { env, paths },
        }) => {
          return webpackConfig;
        },
        overrideJestConfig: ({
          jestConfig,
          cracoConfig,
          pluginOptions,
          context: { env, paths, resolve, rootDir },
        }) => {
          return jestConfig;
        },
      },
      options: {},
    },
  ],
};
