const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
const siteUrl = (process.env.SITE_VERSION ?? '') === '' ? '' : `/${process.env.SITE_VERSION}`
console.log(`Running webpack in ${isDev ? 'development' : 'production'} mode`)

module.exports = {
  entry: './app/assets/src/index.js',
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
              sassOptions: {
                outputStyle: 'compressed'
              }
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'images/'
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'fonts/'
          }
        }
      }
    ]
  },
  output: {
    filename: 'js/bundle.[hash].js',
    path: path.resolve(__dirname, 'app/assets/dist'),
    publicPath: `${siteUrl}/assets/`
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      filename: '.layout.njk',
      template: 'app/assets/src/layout.njk'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/application.[hash].css'
    })
  ]
}
