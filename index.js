"use strict";

const { Scrohla } = require("./src/scrohla");
const { CookieManager } = require("./src/cookie-manager");
const logger = require("winston");
const targetArg = process.argv[2];

if(!targetArg){
  throw Error("informe a target. Ex: npm start submarino");
}

const { target } = require(`./targets/${targetArg}`);

const scrohla = new Scrohla({
  target: target.url
});

const cleanCookies = function(){
  new CookieManager(
    target.auth.host.concat("-").concat(target.auth.user),
    scrohla.getDriver()
  ).clean();
};

try {
  target.execute(scrohla, (result) => logger.info(result) );
} catch(err){
  target.auth && cleanCookies();
  logger.error("Erro interno :( Details: ", err);
}


