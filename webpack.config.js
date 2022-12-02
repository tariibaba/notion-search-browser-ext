const merge = require('lodash.merge');
const TerserPlugin = require('terser-webpack-plugin');

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
                    targets: ['last 1 years and Chrome >= 1'],
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
  experiments: { topLevelAwait: true },
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
    ],
  });
}

module.exports = config;
