"use strict";

const fs = require("fs");

exports.FileManager = class {

    constructor(){
    }

    static writeFile(filePath,data){
        fs.writeFile(filePath,data);
    }

    static readFile(filePath,callback){
        fs.readFile(filePath,"utf8", (error, data) => callback(data));
    }

    static existsFile(filePath, callback){
        fs.exists(filePath, callback);
    }

};