"use strict";

const { Scrohla } = require("./src/scrohla");
const { CookieManager } = require("./src/cookie-manager");
const logger = require("winston");
const targetName = process.argv[2];
const targetUrl = process.argv[3];

if(!targetName){
  throw Error("informe a target. Ex: npm start submarino");
}

const { target } = require(`./targets/${targetName}`);

const scrohla = new Scrohla({
  targetURL: targetUrl || target.url,
  targetName: targetName
});

const cleanCookies = function(){
  new CookieManager(
    targetName.concat("-").concat(target.auth.user),
    scrohla.getDriver()
  ).clean();
};

try {
  target.execute(scrohla, (result) =>  { 
    logger.info(JSON.stringify(result,null,4));
  });
} catch(err){
  target.auth && cleanCookies();
  logger.error("Erro interno :( Details: ", err);
}


