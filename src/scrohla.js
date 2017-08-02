'use strict';

const fs = require('fs');
const { Core } = require('./core');
const TIMEOUT = 5000;

exports.Scrohla = class {

  constructor(params){
    this.params = params;
    this.core = new Core(this.params);
    this.logger = this.core.getLogger();
  }

  getElement(xpath){
    // return this.driver.findElement(this.By.xpath(xpath));
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

  getText(xpath){
    return this.waitFor(xpath).then( elm => elm.getText() );
  }

  waitFor(xpath){
    return this.driver.wait(
      this.until().elementLocated(this.By.xpath(xpath)), 
      this.params.timeout || TIMEOUT
    );
  }

  until(){
    return this.webdriver.until;
  }

  quit(){
    this.driver.quit();
  }

  takeScreenshot(){
    
    if(!this.params.screenshotPath){
      this.logger.warn("Cannot take screenshot :( , Please, set screenshotPath param!");
      return;
    }

    this.driver.takeScreenshot().then((data) => {
      const path = this.params.screenshotPath + "/" + new Date().getTime() + "_screenshot.png";
      fs.writeFile(path, data.replace(/^data:image\/png;base64,/,''), 'base64', (err) => {
        if(err){ 
          throw err;
        }
        this.logger.info("Screenshot saved in: " + path);
      });
    });

  }

  start(){  
    const target = this.params.target;
    if(!target){
      this.logger.warn("Target is required!"); return;
    }
    this.logger.info("Initializing Scrohla ...");
    this.driver = this.core.getDriver();
    this.webdriver = this.core.getWebdriver();
    this.By = this.webdriver.By;
    this.logger.info("Target: ",target);
    this.goTo(target);
  }

}