"use strict";

const path = require("path");
const config = require("../config-app.json");
const { FileManager } = require("./file-manager");
const COOKIE_SEPARATOR = ";";

exports.CookieManager = class {

    constructor(fileName, driver){
        this.driver = driver;
        this.cookiesFile = path.join(config.cookiesPath, fileName);
    }

    store(){
        this.driver.manage().getCookies().then(cookies => {
            let cookiesStr = "";
            for(const cookie of cookies){
                cookiesStr = cookiesStr
                    .concat(JSON.stringify(cookie))
                    .concat(COOKIE_SEPARATOR);
            }
            FileManager.writeFile(this.cookiesFile, cookiesStr.slice(0,-1));
        }); 
    }

    exists(){
        return FileManager.existsFile(this.cookiesFile);
    }

    inject(callback){
        FileManager.readFile(this.cookiesFile, data => {
            for (const value of data.split(COOKIE_SEPARATOR)) {
                const cookie = JSON.parse(value);
                this.driver.manage().addCookie({
                    name: cookie.name,
                    value: cookie.value,
                    path: cookie.path,
                    domain: cookie.domain,
                    secure: cookie.secure,
                    httpOnly: cookie.httpOnly
                });
            }
            callback && callback();
        });
    }

    clean(){
        this.exists() && FileManager.clean(this.cookiesFile);
    }

};