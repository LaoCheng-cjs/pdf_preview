const webpack = require("webpack"); // eslint-disable-line no-unused-vars
const path = require("path");

module.exports = {
    //   入口
// entry: path.resolve(__dirname, './src/main.js'),
    entry: {
        //给入口文件起个名字叫app
        app: path.resolve(__dirname, './index.js')
            //可以写绝对路径或相对路径
    },
    //出口
    output: {
        filename: 'pdf_preview.js', //将代码中一堆文件打包成一捆,打包好的文件名第一个是name,第二个是hash值
        path: path.resolve(__dirname, './dist') //只能写绝对路径
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }, //在main.js中导入的文件是以.css结尾的
            { test: /\.(png|svg|jpg|jpeg|gif)$/, use: ['file-loader'] }
        ]
    },
    plugins: []
}