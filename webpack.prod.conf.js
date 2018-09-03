const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const paths = {
  distFolder: path.resolve(__dirname, 'dist')
}

module.exports = {
  mode: 'production',
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
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('typings-for-css-modules-loader'),
            options: {
              importLoaders: 1,
              sourceMap: false,
              modules: true,
              localIdentName: '[name]_[local][hash:base64:5]',
              namedExport: true,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
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
        ]
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
    ],
  },

  plugins: [
    new CleanWebpackPlugin([paths.distFolder]),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },

};