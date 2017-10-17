'use strict';

const fs = require('fs');
const { Core } = require('./core');
const logger = require('winston');

exports.Scrohla = class {

  constructor(params){
    this.params = params;
    const core = new Core(params);
    this.driver = core.getDriver();
    this.webdriver = core.getWebdriver();
    this.config = core.getConfig();
    this.By = this.webdriver.By;
  }

  getCookies(){
    return this.driver.manage().getCookies(); 
  }

  addCookie(key, value){
    this.driver.manage().addCookie(key,value);
  }

  getElement(xpath){
    return this.waitFor(xpath).then( elm => elm );
  }

  type(text,xpath){
     getElement(xpath).sendKeys(text);
  }

  click(xpath){
    getElement(xpath).click();
  }

  goTo(target){
    this.driver.get(target);
  }

  getText(xpath, time){
    return this.waitFor(xpath, time).then( elm => elm.getText() );
  }

  getAttrib(xpath, attrib, time){
    return this.waitFor(xpath, time).then( elm => elm.getAttribute(attrib) );
  }

  waitFor(xpath, time = this.config.timeout.elementLocated){
    return this.driver.wait(
      this.until().elementLocated(this.By.xpath(xpath)), time
    );
  }

  getCurrentURL(){
    return this.driver.getCurrentUrl();
  }

  until(){
    return this.webdriver.until;
  }

  flow(callback){
    this.webdriver.promise.controlFlow().execute(callback);
  }

  quit(){
    this.driver.quit();
  }

  executeJs(script){
    return this.driver.executeScript(script);
  }

  takeScreenshot(cb){

    const screenshot = this.config.screenshot;
    
    if(!screenshot.path){
      logger.warn("Couldn't take screenshot :( , Please, set screenshot path config!");
      cb && cb();
      return;
    }

    this.driver.takeScreenshot().then((data) => {

      const path = screenshot.path + "/" + new Date().getTime() + "_" + screenshot.name;

      fs.writeFile(path, data.replace(/^data:image\/png;base64,/,''), 'base64', (err) => {
        if(err){ 
          cb && cb(err);
          throw err;
        }
        logger.info("Screenshot saved in: " + path);
        cb && cb();
      });

    });

  }

  start(){  
    const target = this.params.target;
    if(!target){
      logger.warn("Target is required!"); return;
    }
    logger.info("Initializing Scrohla ...");
    logger.info("Target: ",target);
    this.goTo(target);
  }

}