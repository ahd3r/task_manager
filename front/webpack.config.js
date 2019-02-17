const path = require('path');
const createNewHTMLFileRight = require('html-webpack-plugin');
const pastAllCSSInSeparate = require('mini-css-extract-plugin');

const HTMLFile = new createNewHTMLFileRight({
  template:'./src/index.html',
  minify:true
});

module.exports = {
  entry:'./src/index.js',
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'bundle.js'
  },
  mode:'production',
  module:{
    rules:[
      {
        test:/\.js$/,
        use:'babel-loader'
      },
      {
        test:/\.css$/,
        use:[pastAllCSSInSeparate.loader,'css-loader']
      },
      {
        test:/\.html$/,
        use:'html-loader'
      }
    ]
  },
  plugins:[
    HTMLFile,
    new pastAllCSSInSeparate({
      filename:'main.css'
    })
  ]
};
