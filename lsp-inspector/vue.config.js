const BASEURL = ''
// const BASEURL = process.env.TARGET === 'lsp-website' ? '/language-server-protocol/inspector' : '/'

const OUTPUT_DIR = '../docs';

module.exports = {
  baseUrl: BASEURL,
  outputDir: OUTPUT_DIR,
  devServer: {
    overlay: false
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        options: {
          // Prefer `dart-sass`
          implementation: require('sass')
        }
      }
    }
  }
}
