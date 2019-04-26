let path = require('path');

let conf = {
    entry: "./rsdu/src/js/login.js",
    output: {
        path: path.resolve(__dirname, "./src/js/"),
        filename: "rsdu.login.build.js"
    }
};

module.exports = conf;
