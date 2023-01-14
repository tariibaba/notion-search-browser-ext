const webpack = require('webpack');
const fs = require('fs');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/** @type import('webpack').Configuration */
let config = {
  context: `${__dirname}/src`,
  entry: {
    background: './background/main.ts',
    popup: './popup/main.tsx',
    debug: './debug/main.ts',
    options: './options/main.tsx',
    'helps/empty-search-results': './helps/emptySearchResults.ts',
  },
  output: {
    path: `${__dirname}/public/js`,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3,
                  },
                ],
              ],
            },
          },
          'ts-loader',
        ],
      },
      {
        test: /\.p?css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-nested'],
              },
            },
          },
        ],
      },
    ],
  },
  devtool: false,
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: (chunk) => chunk.name !== 'background',
    },
    minimize: false,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  experiments: {
    topLevelAwait: true,
  },
  // Chrome 拡張においてファイルサイズは大した問題ではない
  performance: {
    hints: false,
  },
};

module.exports = (...[, argv]) => {
  const mode = argv.mode || 'development';
  config.mode = mode;
  const isDevelopment = mode === 'development';

  config.plugins = [
    new webpack.DefinePlugin({
      IS_SENTRY_ENABLED:
        (process.env.IS_SENTRY_ENABLED &&
          JSON.parse(process.env.IS_SENTRY_ENABLED)) ??
        true,
      SETNRY_ARGS: {
        dsn: JSON.stringify(
          isDevelopment
            ? 'https://cba3c32ae1404f56a39f5cb4102beb64@o49171.ingest.sentry.io/4504401197989888'
            : 'https://f3a64ab117364c0cab0e2edf79c51113@o49171.ingest.sentry.io/4504401230823424',
        ),
        release: JSON.stringify(
          JSON.parse(fs.readFileSync('./public/manifest.json').toString())
            .version,
        ),
      },
    }),
    // new BundleAnalyzerPlugin(),
  ];
  // TODO: これがあると minify:false が効かない。
  // 本番環境で console.info が吐かれてる問題があるので、それを対処するときに向き合う。
  // const TerserPlugin = require('terser-webpack-plugin');
  // if (!isDevelopment) {
  //   config.plugins.push(
  //     new TerserPlugin({
  //       terserOptions: {
  //         compress: {
  //           pure_funcs: ['console.log', 'console.info'],
  //         },
  //       },
  //     }),
  //   );
  // }

  return config;
};
