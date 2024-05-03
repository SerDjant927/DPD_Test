const Webpack = require('webpack');

module.exports = {
  // ...
  plugins: [
    new Webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
};