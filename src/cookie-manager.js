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
        // this.driver.manage().getCookies().then(cookies => {
        //     let cookiesStr = "";
        //     for(const cookie of cookies){
        //         cookiesStr = cookiesStr
        //             .concat(JSON.stringify(cookie))
        //             .concat(COOKIE_SEPARATOR);
        //     }
        //     FileManager.writeFile(this.cookiesFile, cookiesStr.slice(0,-1));
        // }); 

        this.driver.manage().timeouts().pageLoadTimeout(30000);
        this.driver.executeScript(function(){
            return document.cookie;
        }).then(cookies => {
            console.log("cookies:",cookies);
            FileManager.writeFile(this.cookiesFile, cookies);
        });

    }

    hasCookies(callback){
        return FileManager.existsFile(this.cookiesFile, callback);
    }

    inject(){
        FileManager.readFile(this.cookiesFile, cookies => { 
            
            this.driver.manage().timeouts().pageLoadTimeout(30000); 
            const script = `document.cookie='${cookies}';return document.cookie;`; 
            console.log("script:",script);
            this.driver.executeScript(script).then( text => console.log("executou:",text));
        });
    }

};