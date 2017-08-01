'use strict';

const webdriver = require('selenium-webdriver');
const logger = require('winston');
const fs = require('fs');

exports.Core = class {

  constructor(params){
    this.params = params;
    this.configure();
    this.init();
  }

  init(){
    logger.info("Initializing scrawler ...");
    logger.info("Target: ",this.params.target);
    this.driver.get(this.params.target);
  }

  configure(){
    const builder = new webdriver.Builder();
    if("chrome" === this.params.browser){
      this.configureChrome(builder);
    }
    this.driver = builder.build();
  }

  getDriver(){
    return this.driver;
  }

  getBy(){
    return webdriver.By;
  }

  getUntil(){
    return webdriver.until;
  }

  quit(){
    this.driver.quit();
  }

  configureChrome(builder){
    const chromeCapabilities = webdriver.Capabilities.chrome();
    chromeCapabilities.set('chromeOptions', { "args": this.params.args });
    builder.withCapabilities(chromeCapabilities);
  }

  takeScreenshot(){
    if(!this.params.screenshotPath){
      logger.warn("Cannot take screenshot :( , Please, set screenshotPath param!");
      return;
    }
    this.driver.takeScreenshot().then((data) => {
        fs.writeFile(
          this.params.screenshotPath + "/screenshot.png", 
          data.replace(/^data:image\/png;base64,/,''), 'base64', 
          (err) => {
            if(err) throw err;
          }
        );
    });
  }

}