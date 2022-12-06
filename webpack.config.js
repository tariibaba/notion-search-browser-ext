const merge = require('lodash.merge');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/** @type import('webpack').Configuration */
let config = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    background: './src/ts/background.ts',
    popup: './src/ts/popup.tsx',
    options: './src/ts/options.ts',
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
        test: /\.pcss$/,
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
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: (chunk) => chunk.name !== 'background',
    },
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  experiments: {
    topLevelAwait: true,
  },
  // // Chrome 拡張においてファイルサイズは大した問題ではないので無視する
  // performance: {
  //   hints: false,
  // },
};

if (config.mode === 'development') {
  config = merge(config, {
    devtool: 'inline-source-map',
  });
} else {
  config = merge(config, {
    plugins: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            pure_funcs: ['console.log', 'console.info'],
          },
        },
      }),
      // new BundleAnalyzerPlugin(),
    ],
  });
}

module.exports = config;
