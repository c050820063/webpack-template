'use strict'
const merge = require('webpack-merge')
const ip = require('ip')
const chalk = require('chalk')
const portfinder = require('portfinder')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const utils = require('./utils')
const config = require('../config')
const baseWebpackConfig = require('./webpack.base.conf')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
const PROD_ENV = process.env.PROD_ENV
console.log('%c PROD_ENV =>', 'color:blue;font-size:18px', PROD_ENV)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  module: {
    rules: [
      ...utils.createStyleLoaders({
        sourceMap: config.dev.cssSourceMap,
      })
    ]
  },
  devtool: config.dev.devtool,
  devServer: {
    clientLogLevel: 'warning',
    hot: true,
    contentBase: false,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env'),
      'PROD_ENV': JSON.stringify(PROD_ENV)
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      const myIp = ip.address()
      process.env.PORT = port
      devWebpackConfig.devServer.port = port
      const host = devWebpackConfig.devServer.host === '0.0.0.0' ? 'localhost' : devWebpackConfig.devServer.host

      const localUrl = `http://${host}:${port}`
      const localServiceUrl = `http://${myIp}:${port}`

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`project is running here:
          - Local:    ${chalk.blue(localUrl)}
          - Network:  ${chalk.blue(localServiceUrl)}
          `],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})