const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const paths = {
  distFolder: path.resolve(__dirname, 'dist_dev'),
  assetsFolder: path.resolve(__dirname, 'assets'),
}

module.exports = {
  mode: 'development',
  entry: {
    app: ['./src/index.tsx'],
    react: ['react', 'react-dom']
  },
  output: {
    publicPath: '/',
    filename: 'js/[name].bundle.js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    path: paths.distFolder,
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'cheap-module-source-map',
  // Target environment
  target: 'web',

  resolve: {
    // Resolve module requests (default)
    modules: ['node_modules'],
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      // Lint TypeScript
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: 'stylish',
            },
            loader: require.resolve('tslint-loader'),
          }
        ]
      },
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('awesome-typescript-loader'),
            options: {
              useBabel: true,
              babelCore: '@babel/core',
              useCache: true,
            }
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      // Load CSS files as modules and generate typing files for TS
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('typings-for-css-modules-loader'),
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: '[name]_[local][hash:base64:5]',
              namedExport: true,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // Necessary for external CSS imports to work
              // https://github.com/facebookincubator/create-react-app/issues/2677
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 4096,
              fallback: 'file-loader',
              name: 'images/[hash].[ext]'
            }
          }
        ],
      },
    ]
  },

  plugins: [
    new CleanWebpackPlugin([paths.distFolder]),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html'
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    contentBase: paths.assetsFolder,
    index: 'index.html',
    hot: true
  },
};