const path = require("path");

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "webpack"],
    files: [
      {
        pattern: "public/img/logo-sanmarcos.png",
        included: false,
        watched: false,
      },
      { pattern: "src/tests/**/*.spec.js", watched: true },
      { pattern: "src/tests/**/*.spec.jsx", watched: true },
    ],
    preprocessors: {
      "src/tests/**/*.spec.js": ["webpack"],
      "src/tests/**/*.spec.jsx": ["webpack"],
    },
    webpack: {
      mode: "development",
      devtool: "inline-source-map",
      resolve: { extensions: [".js", ".jsx"] },
      module: {
        rules: [
          {
            test: /\.[jt]sx?$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                babelrc: false,
                configFile: false,
                presets: [
                  ["@babel/preset-env", { targets: { chrome: "100" } }],
                  ["@babel/preset-react", { runtime: "automatic" }],
                ],
                plugins: [["istanbul", { exclude: ["**/*.spec.js"] }]],
              },
            },
          },
        ],
      },
    },
    webpackMiddleware: { stats: "errors-only" },
    reporters: ["progress", "coverage"],
    proxies: { "/img/": "/base/public/img/" },
    coverageReporter: {
      dir: path.join(__dirname, "coverage"),
      reporters: [{ type: "html", subdir: "html" }, { type: "text-summary" }],
      check: {
        global: { statements: 30, branches: 20, functions: 30, lines: 30 },
      },
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox", "--disable-dev-shm-usage"],
      },
    },
    browsers: ["ChromeHeadlessNoSandbox"],
    singleRun: true,
    client: { jasmine: { random: false, timeoutInterval: 10000 } },
  });
};
