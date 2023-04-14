module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: ['./src/main/app.ts'],
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: require('./webpack.aliases'),
  },
  stats: 'minimal',
  externals: {
    "playwright-extra": "playwright-extra",
    "puppeteer-extra-plugin-stealth": "puppeteer-extra-plugin-stealth",
    "csv-parse/lib/sync": "csv-parse/sync",
    "@extra/proxy-router": "@extra/proxy-router",
    "is-plain-object": "is-plain-object",
  },
};
