"use strict";

const { Scrohla } = require("./src/scrohla");
const { CookieManager } = require("./src/cookie-manager");
const logger = require("./src/logger");
const config = require("./config-app.json");

const cleanCookies = function(scrohla, target){
    new CookieManager(
        targetName.concat("-").concat(target.auth.user),
        scrohla.getDriver()
    ).clean();
};

function endCollect(scrohla){
    
    if(config.browser.logBrowser){
        scrohla.sleep(5000);
        scrohla.flow(() => logger.warn("Log do browser capturado durante coleta:"));
        scrohla.getDriver().manage().logs().get("browser").then(function(entries) {                
            entries.forEach(entry =>  { 
                scrohla.flow( () => logger.warn(`[ LOG BROWSER ] [${entry.level.name}] ${entry.message}`) );
            });  
        });        
    } 
    
    scrohla.quit();
    scrohla.flow(() => console.timeEnd("Process time"));  // eslint-disable-line 
   
}

function init(targetName, targetUrl, cb){

    console.time("Process time");  // eslint-disable-line 
    
    if(!targetName){
        throw Error("informe a target. Ex: npm start submarino");
    }
    
    const { target } = require(`${__dirname}/targets/${targetName}`);
    
    const scrohla = new Scrohla({ 
        targetURL: targetUrl || target.url, 
        targetName: targetName,
        custom: target.custom
    });

    try {
        target.execute(scrohla,(result) => {
            logger.info(`Result => ${JSON.stringify(result,null,4)}`);
            cb && cb(result);
            endCollect(scrohla);
        });
    } catch(err){
        target.auth && cleanCookies(scrohla,target);
        logger.error("Erro interno :( Details: ", err);
        endCollect(scrohla);
    } 

}

function getParam(param){
    const index = process.argv.findIndex( arg => arg === param );
    if(index !== -1){
        return process.argv[index + 1];
    }
    return null;
}

const targetName = getParam("--target");
const targetUrl = getParam("--url");

if(targetName || targetUrl){
    init(targetName, targetUrl); 
}

module.exports = { init : init };
