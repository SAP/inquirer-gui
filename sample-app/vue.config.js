const { defineConfig } = require('@vue/cli-service')
const path = require('path');
module.exports = defineConfig({
  // transpileDependencies: true,
  lintOnSave: false,
  configureWebpack:{
    resolve:{
        alias:{
           vue: path.resolve('./node_modules/vue')
        }
    }
}
})
