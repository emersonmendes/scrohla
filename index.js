'use strict';

const { Scrohla } = require('./src/scrohla');
const logger = require('winston');
const targetArg = process.argv[2];

if(!targetArg){
  throw Error("informe a target. Ex: npm start submarino");
}

const { target } = require('./targets/' + targetArg);

const scrohla = new Scrohla({
  target: target.url
});

target.execute(scrohla, (result) => {
  logger.info(result);
});



