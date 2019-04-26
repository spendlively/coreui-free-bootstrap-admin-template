let path = require('path');

let conf = {
    entry: "./rsdu/src/js/index.js",
    output: {
        path: path.resolve(__dirname, "./src/js/"),
        filename: "rsdu.build.js"
    }
    // ,
    // module: {
    //     //Описание правил, с какими файлами, что делать
    //     rules: [
    //         {
    //             //скормить все файлы .css babel-loader'у
    //             test: /\.css$/,
    //             use: [
    //                 //считавает данные из файла и возвращает их в корректном виде без интерпретации
    //                 "style-loader",
    //                 //хранит css в js и потом вставляет код css в тэг head
    //                 "css-loader"
    //             ]
    //         }
    //     ]
    // }
};

module.exports = conf;
