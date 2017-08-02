'use strict';

const webdriver = require('selenium-webdriver');
const logger = require('winston');

exports.Core = class {

  constructor(params){
    this.params = params;
    this.configure();
  }

  configure(){
    const builder = new webdriver.Builder();
    this.configureChrome(builder);
    this.driver = builder.build();
  }

  configureChrome(builder){

    let defaultArgs = [ 
      "--start-maximized",
      "--hide-scrollbars",
      "--headless",
      "--disable-gpu"
    ];

    if(this.params.resetArgs){
      defaultArgs = [];
    }

    if(this.params.args){
      defaultArgs = defaultArgs.concat(this.params.args)
    }

    logger.info("Args: ", defaultArgs);

    const chromeCapabilities = webdriver.Capabilities.chrome();
    chromeCapabilities.set('chromeOptions', { "args": defaultArgs });
    builder.withCapabilities(chromeCapabilities);
  
  }

  getWebdriver(){
    return webdriver;
  }

  getDriver(){
    return this.driver;
  }

  getLogger(){
    return logger;
  }

}