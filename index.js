const { Scrohla } = require('./src/scrohla');
const logger = require('winston');
    
const scrohla = new Scrohla({
  //args: [ "--incognito" ],
  //resetArgs: true,
  //timeout: 10000,
  target: "https://www.google.com",
  screenshotPath: "/home/emerson/Downloads"
});

scrohla.start();



scrohla.quit();


