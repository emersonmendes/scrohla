'use strict';

const { Scrohla } = require('./src/scrohla');
const { target } = require('./targets/submarino');
const { DataBase } = require('./src/db'); 
const logger = require('winston');

const scrohla = new Scrohla({
  target: target.url
});

target.execute(scrohla, (result) => {

  const db = new DataBase();
  
  db.save(target.key, result,() => {
    logger.info("Saved: ", result);
    scrohla.quit();
  });

});



