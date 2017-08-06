'use strict';

const webdriver = require('selenium-webdriver');
const config = require('../config-app.json');

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

    let defaultArgs = config.browser.args;

    if(config.browser.ignoreArgs){
      defaultArgs = [];
    }

    if(this.params.args){
      defaultArgs = defaultArgs.concat(this.params.args)
    }

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

  getConfig(){
    return config;
  }

}