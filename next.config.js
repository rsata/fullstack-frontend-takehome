'use strict'
const webpack = require('webpack')
const withSourceMaps = require('@zeit/next-source-maps')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const withTypescript = require('@zeit/next-typescript')

const nextConfig = {
  distDir: '../dist/.next',
  analyzeServer: false,
  analyzeBrowser: Boolean(process.env.ANALYSE),
  // Disable the next `X-Powered-By` header
  poweredByHeader: false,
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV,
    IS_LOCAL: process.env.IS_LOCAL,
  },
  webpack(config) {
    // Hack to only bundle moment's en locale
    // https://github.com/moment/moment/issues/1435#issuecomment-187100876
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /^\.\/(en)$/)
    )

    return config
  }
}

module.exports = withTypescript(withBundleAnalyzer(withSourceMaps(nextConfig)))
