const config = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    background: './src/background.ts',
    popup: './src/popup.ts',
    options: './src/options.ts',
    'content-script': './src/contentScript.ts',
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
                  targets: ['defaults'],
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
};

if (config.mode === 'development') {
  config.devtool = 'inline-source-map';
}

module.exports = config;
