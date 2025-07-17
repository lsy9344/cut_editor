const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    mode: argv.mode || 'development',
    entry: './src/renderer/index.tsx',
    target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js'),
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@renderer': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
    fallback: {
      "fs": false,
      "path": false,
      "crypto": false,
      "stream": false,
      "buffer": require.resolve("buffer"),
      "process": require.resolve("process/browser"),
      "util": false,
      "assert": false,
      "http": false,
      "https": false,
      "os": false,
      "url": false,
      "canvas": false,
      "jsdom": false,
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist/renderer'),
    filename: 'index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/index.html',
      filename: 'index.html',
    }),
    new webpack.DefinePlugin({
      global: 'globalThis',
      'process.env.NODE_ENV': JSON.stringify(argv.mode || 'development'),
    }),
    new webpack.ProvidePlugin({
      global: 'globalThis',
      Buffer: ['buffer', 'Buffer'],
    }),
    // Additional global polyfill for Fabric.js
    new webpack.BannerPlugin({
      banner: `// Global polyfill for Fabric.js compatibility
if (typeof global === 'undefined') {
  var global = globalThis;
}
if (typeof window !== 'undefined' && typeof window.global === 'undefined') {
  window.global = window;
}`,
      raw: true,
      entryOnly: false,
    }),
  ],
  devServer: {
    port: 3000,
    host: 'localhost',
    hot: true,
    historyApiFallback: true,
    allowedHosts: 'all',
    client: {
      logging: 'warn',
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    // CSP headers are handled by the main process to avoid conflicts
  },
  devtool: isDevelopment ? 'eval-source-map' : 'source-map',
  node: {
    __dirname: false,
    __filename: false,
  },
  };
};