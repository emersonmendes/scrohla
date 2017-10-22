"use strict";

const fs = require("fs");
const logger = require("winston");
const { Core } = require("./core");
const { CookieManager } = require("./cookie-manager");

exports.Scrohla = class {

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

  doLogin(user, pass) {
    this.type(user, "(//input[@type='email' or @name='username'])[1]");
    this.type(pass, "(//input[@type='password'])[1]");
    this.submit("(//*[@type='password'])[1]//ancestor::form");
  }

  authenticate(data) {

    const cookies = this.params.targetName.concat("-").concat(data.user);

    const cookieManager = new CookieManager(cookies,this.driver);

    if (cookieManager.exists()) {
      logger.info("using cookies: %s",cookies);
      this.waitPageLoad();
      this.flow(() => cookieManager.inject(() => this.reload()));
    } else {
      logger.info("doing login ...");
      this.doLogin(data.user, data.pass);
      this.waitPageLoad();
      this.sleep(7000);
      this.flow(() => cookieManager.store());
    }

  }

  type(text, xpath) {
    this.waitFor(xpath).then(elm => elm.sendKeys(text));
  }

  submit(xpath) {
    this.waitFor(xpath).then(elm => elm.submit());
  }

  click(xpath, required = true) {
    this.waitFor(xpath)
      .then(elm => elm.click())
      .catch(() => {
        const msg = "Não conseguiu achar o xpath: " + xpath;
        if (required) {
          throw Error(msg);
        }
        logger.warn(msg);
      });
  }

  goTo(url) {
    this.driver.get(url);
  }

  getText(xpath, time) {
    return this.waitFor(xpath, time).then(elm => elm.getText());
  }

  findElements(xpath) {
    return this.driver.findElements(this.By.xpath(xpath));
  }

  getAttrib(xpath, attrib, time) {
    return this.waitFor(xpath, time).then(elm => elm.getAttribute(attrib));
  }

  waitFor(xpath, time = this.config.timeout.elementLocated) {
    return this.driver.wait(
      this.until().elementLocated(this.By.xpath(xpath)), time
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

  takeScreenshot(cb) {

    const screenshot = this.config.screenshot;

    if (!screenshot.path) {
      logger.warn("Couldnt take screenshot :( , Please, set screenshot path config!");
      cb && cb();
      return;
    }

    this.driver.takeScreenshot().then((data) => {

      const path = screenshot.path + "/" + new Date().getTime() + "_" + screenshot.name;

      fs.writeFile(path, data.replace(/^data:image\/png;base64,/, ""), "base64", (err) => {
        if (err) {
          cb && cb(err);
          throw err;
        }
        logger.info("Screenshot saved in: " + path);
        cb && cb();
      });

    });

  }

};