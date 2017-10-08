'use strict';

//const { DataBase } = require('./src/db'); 

const { Scrohla } = require('./src/scrohla');
const logger = require('winston');
const targetArg = process.argv[2];

if(!targetArg){
  throw Error("informe a target. Ex: npm start phantom-site");
}

const { target } = require('./targets/' + targetArg);

const scrohla = new Scrohla({
  target: target.url
});

target.execute(scrohla, (result) => {

  logger.info(result);
  
  scrohla.quit();
  
  //const db = new DataBase();
  // db.save(target.key, result,() => {
  //   logger.info("Saved: ", result);
  //   scrohla.quit();
  // });

});



