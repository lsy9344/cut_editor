const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/preload/index.ts',
  target: 'electron-preload',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist/preload'),
    filename: 'index.js',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};