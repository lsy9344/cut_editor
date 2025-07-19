const path = require('path');

module.exports = (env, argv) => ({
  mode: argv.mode || 'development',
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
    library: {
      type: 'commonjs2',
    },
  },
  externals: {
    // Electron APIs are available in preload context
    electron: 'commonjs electron',
    // Node.js built-ins are available in preload context
    buffer: 'commonjs buffer',
    fs: 'commonjs fs',
    path: 'commonjs path',
    os: 'commonjs os',
    crypto: 'commonjs crypto',
  },
  node: {
    __dirname: false,
    __filename: false,
  },
  devtool: argv.mode === 'development' ? 'eval-source-map' : 'source-map',
});