"use strict";

const path = require("path");
const config = require("../config-app.json");
const fs = require("fs");
const logger = require("./logger");

const COOKIE_SEPARATOR = ";";

class CookieManager {

    constructor(fileName, driver){
        this.driver = driver;
        this.cookiesFile = path.join(config.cookiesPath, fileName);
    }

    async store(){
        const cookies = await this.driver.manage().getCookies(); 
        let cookiesStr = "";
        for(const cookie of cookies){
            cookiesStr = cookiesStr
                .concat(JSON.stringify(cookie))
                .concat(COOKIE_SEPARATOR);
        }
        await fs.writeFile(this.cookiesFile, cookiesStr.slice(0,-1), err => {
            if(err){
                logger.warn(err);
                logger.warn(`Não conseguiu salvar os cookies. Verifique se o diretorio '${config.cookiesPath}' existe.`);
            }
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
                }).catch(() => {
                    logger.warn(`Não conseguiu injetar o cookie: ${cookie.name}`);
                });
            }
            callback && callback();
        });
    }

    clean(){
        this.exists() && fs.unlink(this.cookiesFile);
    }

}

module.exports.CookieManager = CookieManager;
