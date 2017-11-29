"use strict";

const fs = require("fs");
const logger = require("winston");
const { Core } = require("./core");
const { CookieManager } = require("./cookie-manager");

class Scrohla {

  constructor(params) {
    this.params = params;
    const core = new Core(params);
    this.driver = core.getDriver();
    this.webdriver = core.getWebdriver();
    this.controlFlow = this.webdriver.promise.controlFlow();
    this.config = core.getConfig();
    this.By = this.webdriver.By;
    this.Key = this.webdriver.Key;
  }

  logInfo(text){
    this.flow(() => logger.info(text));
  }

  doLogin(user, pass) {
    this.type(user.data, user.xpath);
    this.type(pass.data, pass.xpath);
    this.submit( pass.xpath + "//ancestor::form");
  }

  useCookies(cookies){
    const cookieManager = new CookieManager(cookies,this.driver);
    this.waitPageLoad();
    if (cookieManager.exists()) {
      logger.info("using cookies: %s",cookies);
      this.flow(() => cookieManager.inject(() => this.reload()));
    }else{
      this.sleep(7000);
      this.flow(() => cookieManager.store());
    }
  }

  authenticate(auth) {

    this.goTo(auth.loginURL);

    const cookies = this.params.targetName.concat("-").concat(auth.user.data);
  
    const cookieManager = new CookieManager(cookies,this.driver);
    
    if (cookieManager.exists()) {
      logger.info("using cookies: %s",cookies);
      this.waitPageLoad();
      this.flow(() => cookieManager.inject(() => this.reload()));
    } else {
      logger.info("doing login ...");
      this.doLogin(auth.user, auth.pass);
      this.waitPageLoad();
      this.sleep(7000);
      this.flow(() => cookieManager.store());
    }

  }

  type(text, xpath) {
    this.waitForVisible(xpath);
    this.findElement(xpath).sendKeys(text);
  }

  submit(xpath) {
    this.waitFor(xpath).then(elm => elm.submit());
  }

  click(xpath, required = true) {
    this.waitForVisible(xpath);
    this.findElement(xpath)
      .then(elm => elm.click())
      .catch(() => {
        const msg = "Não conseguiu achar o xpath: " + xpath;
        if (required) 
          throw Error(msg);
      });
  }

  goTo(url) {
    return this.driver.get(url);
  }

  getText(xpath, time) {
    return this.waitFor(xpath, time).then(elm => elm.getText());
  }

  findElements(xpath) {
    return this.driver.findElements(this.By.xpath(xpath));
  }

  findElement(xpath) {
    return this.driver.findElement(this.By.xpath(xpath));
  }

  getAttrib(xpath, attrib, time) {
    return this.waitFor(xpath, time).then(elm => elm.getAttribute(attrib));
  }

  waitFor(xpath, time = 30000) {
    return this.driver.wait(
      this.until().elementLocated(this.By.xpath(xpath)), time
    );
  }

  waitForVisible(xpath, time = 30000) {
    return this.driver.wait(
      this.until().elementIsVisible(this.waitFor(xpath,time)), time
    );
  }

  waitForNotVisible(xpath, time = 30000) {
    return this.driver.wait(
      this.until().elementIsNotVisible(this.waitFor(xpath,time)), time
    );
  }

  getCurrentURL() {
    return this.driver.getCurrentUrl();
  }

  until() {
    return this.webdriver.until;
  }

  flow(callback) {
    this.controlFlow.execute(callback);
  }

  quit() {
    this.driver.quit();
  }

  executeJs(script) {
    return this.driver.executeScript(script);
  }

  reload() {
    logger.info("Reloading ...");
    this.driver.navigate().refresh();
  }

  sleep(ms = 10000) {
    this.flow(() => logger.info("sleeping for %s milliseconds",ms));
    this.driver.sleep(ms);
  }

  waitPageLoad(ms = 500000) {
    return this.driver.manage().timeouts().pageLoadTimeout(ms);
  }

  implicitlyWait(ms = 10000){
    this.driver.manage().timeouts().implicitlyWait(ms);
  }

  getKey() {
    return this.Key;
  }

  getDriver() {
    return this.driver;
  }

  start() {
    const targetURL = this.params.targetURL;
    if (!targetURL) {
      logger.warn("Target is required!"); return;
    }
    logger.info("Initializing Scrohla ...");
    logger.info("Target url: ", targetURL);
    this.goTo(targetURL);
  }

  takeScreenshotBase64(){
    return this.driver.takeScreenshot();
  }

  takeScreenshot() {

    const screenshot = this.config.screenshot;

    if (!screenshot.path) {
      logger.warn("Couldnt take screenshot :( , Please, set screenshot path config!");
      return;
    }

    this.driver.takeScreenshot().then((data) => {

      const path = screenshot.path + "/" + new Date().getTime() + "_" + screenshot.name;

      fs.writeFile(path, data.replace(/^data:image\/png;base64,/, ""), "base64", (err) => {
        if (err) {
          throw err;
        }
        logger.info("Screenshot saved in: " + path);
      });

    });

  }

}

module.exports.Scrohla = Scrohla;