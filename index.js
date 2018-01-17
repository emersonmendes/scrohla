"use strict";

const { Scrohla } = require("./src/scrohla");
const { CookieManager } = require("./src/cookie-manager");
const logger = require("./src/logger");

const cleanCookies = function(scrohla, target){
    new CookieManager(
        targetName.concat("-").concat(target.auth.user),
        scrohla.getDriver()
    ).clean();
};

function init(targetName, targetUrl){
    
    if(!targetName){
        throw Error("informe a target. Ex: npm start submarino");
    }
    
    const { target } = require(`${__dirname}/targets/${targetName}`);
    
    const scrohla = new Scrohla({ targetURL: targetUrl || target.url, targetName: targetName });

    try {
        target.execute(scrohla,(result) => {
            logger.info(`Result => ${JSON.stringify(result,null,4)}`);
            scrohla.quit();
            process.exit();
        });
    } catch(err){
        target.auth && cleanCookies(scrohla,target);
        logger.error("Erro interno :( Details: ", err);
    }

}

const targetName = process.argv[2];
const targetUrl = process.argv[3];

if(targetName || targetUrl){
    init(targetName, targetUrl); 
}

module.exports = { init : init };