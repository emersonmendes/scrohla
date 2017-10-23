"use strict";

const path = require("path");
const config = require("../config-app.json");
const fs = require("fs");
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
            fs.writeFile(this.cookiesFile, cookiesStr.slice(0,-1));
        }); 
    }

    exists(){
        return fs.existsSync(this.cookiesFile);
    }

    inject(callback){
        fs.readFile(this.cookiesFile,"utf8", (error, data) => {
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
        this.exists() && fs.unlink(this.cookiesFile);
    }

};