const port = process.env.port || process.env.npm_config_port || 8083
const webpack = require('webpack');

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  publicPath: '/PSBT-XVERSE',
  // 输出文件目录
  outputDir: './PSBT-XVERSE',
  productionSourceMap: false,
  devServer: {
    port: port,
    host: '0.0.0.0',
    open: true,
    // proxy: {
    //   "/": {
    //     target: "http://127.0.0.1",
    //     changeOrigin: true,
    //     ws: false,
    //     pathRewrite: {
    //       '^/': ''
    //     }
    //   }
    // }
  },
  configureWebpack:{
    plugins:[
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ]
  }
}