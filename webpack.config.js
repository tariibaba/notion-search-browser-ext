const config = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    background: './src/background.ts',
    popup: './src/popup.tsx',
    options: './src/options.ts',
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
        test: /\.ts/,
        exclude: /node_modules/,
        use: {
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
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks(chunk) {
        return chunk.name !== 'background';
      },
    },
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  experiments: { topLevelAwait: true },
};

if (config.mode === 'development') {
  config.devtool = 'inline-source-map';
}

module.exports = config;
