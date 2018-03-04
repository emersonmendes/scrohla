"use strict";

const fs = require("fs");
const request = require("request");
const path = require("path");
const logger = require("./logger");

class FileUtils {

  static writeFile(path, content, callback){
    fs.writeFile(path, content, callback);
  }

  static readFile(path, callback){
    fs.readFile(path, "utf8", callback);
  }

  static download(url, localPath){
    return new Promise( (resolve, reject) => {
      
      const dest = path.join(localPath,path.basename(url));
      const file = fs.createWriteStream(dest);
      const sendReq = request.get(url);
  
      sendReq.on("response", function(response) {
        const statusCode = response.statusCode;
        statusCode !== 200 && logger.warn("Status code %s for %s ",statusCode, url);
        resolve();
      });
  
      sendReq.on("error", () => {
        fs.unlink(dest);
        reject();
      });
  
      sendReq.pipe(file);
  
      file.on("finish", () => file.close());
  
      file.on("error", () => {
        fs.unlink(dest);
        reject();
      });
      
    });
  }

}

module.exports.FileUtils = FileUtils;