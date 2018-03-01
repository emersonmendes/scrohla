"use strict";

const fs = require("fs");
const logger = require("./logger");
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

  logWarn(text){
    this.flow(() => logger.warn(text));
  }

  doLogin(user, pass) {
    this.type(user.data, user.xpath);
    this.type(pass.data, pass.xpath);
    this.submit( pass.xpath + "//ancestor::form");
  }

  authenticate(dto) {

    this.goTo(dto.loginURL);
    dto.beforeLogin && this.flow(dto.beforeLogin);
    const cookies = `${this.params.targetName}-${dto.user.data}`;
    const cookieManager = new CookieManager(cookies,this.driver);
    
    if (dto.cookies && cookieManager.exists()) {
      this.logInfo(`Using cookies: ${cookies}`);
      this.flow(() => cookieManager.inject(() => this.reload()));
      this.sleep(5000);
    } else {
      this.logInfo("Doing login ...");
      this.doLogin(dto.user, dto.pass);
      this.sleep(5000);
      this.flow(() => cookieManager.store());
    }

  }

  /**
   * Envia texto para um elemento de input
   * @param {string} text 
   * @param {string} xpath 
   */
  type(text, xpath) {
    this.waitForVisible(xpath);
    this.findElement(xpath).sendKeys(text);
  }

  submit(xpath) {
    this.waitForLocated(xpath).then(elm => elm.submit());
  }

  click(xpath, required = true) {
    this.waitForVisible(xpath);
    this.findElement(xpath)
      .then(elm => elm.click())
      .catch(() => {
        if (required) {
          throw Error(`Não conseguiu achar o xpath: ${xpath}`);
        }
      });
  }

  goTo(url) {
    this.logInfo(`Going to ${url}`);
    return this.driver.get(url);
  }

  scrollToPageBottom(){
    this.executeJs("window.scrollTo(0,document.body.scrollHeight);", "");
  }

  /**
   * Pega o texto de um elemento
   * @param {string} xpath 
   * @param {number} time 
   */
  getText(xpath, time) {
    return this.waitForLocated(xpath, time).then(elm => elm.getText());
  }

  findElements(xpath) {
    return this.driver.findElements(this.By.xpath(xpath));
  }

  findElement(arg, xpath) {
    if(!xpath) {
      return this.driver.findElement(this.By.xpath(arg));
    } 
    return arg.findElement(this.By.xpath(xpath));
  }

  promiseAll(promises){
    return this.webdriver.promise.all(promises);
  }

  /**
   * Pega o atributo de um elemento
   * @param {string} xpath 
   * @param {string} attrib 
   * @param {number} time 
   */
  getAttrib(xpath, attrib, time) {
    return this.waitForLocated(xpath, time).then(elm => elm.getAttribute(attrib));
  }

  /**
   * Aguarda e retorna o elemento quando encontrado no dom
   */
  waitForLocated(xpath, time = 30000) {
    return this.driver.wait(this.until().elementLocated(this.By.xpath(xpath)), time);
  }

  /**
   * Aguarda e retorna o elemento quando visível no dom
   * @param { string } xpath 
   * @param { number } time 
   */
  waitForVisible(xpath, time = 30000) {
    return this.driver.wait(this.until().elementIsVisible(this.findElement(xpath)), time );
  }

  /**
   * Aguarda e retorna o elemento quando não mais visível no dom
   * @param { string } xpath 
   * @param { number } time 
   */
  waitForNotVisible(xpath, time = 30000) {
    return this.driver.wait(this.until().elementIsNotVisible(this.findElement(xpath)), time );
  }

  /**
   * Pega a url corrente
   */
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
    return this.driver.quit();
  }

  /** 
   * Why not: this.driver.manage().timeouts().pageLoadTimeout(500000) ?
  */
  waitForDocumentReady(){
    return this.driver.wait(() => this.executeJs("return document.readyState === 'complete'"));
  }

  /**
   * Execute javascript no browser
   * @param {(function|string)} script - JavaScript a ser executado no browser
   * @param {*} args 
   */
  executeJs(script, args) {
    return this.driver.executeScript(script, args);
  }

  mouseMoveTo(xpath){
    this.driver.actions().mouseMove(this.waitForLocated(xpath)).perform();
  }

  reload() {
    this.logInfo("Reloading ...");
    this.driver.navigate().refresh();
  }

  sleep(ms = 10000) {
    this.logInfo(`Sleeping - ${ms/1000} seconds`);
    this.driver.sleep(ms);
  }

  getKey() {
    return this.Key;
  }

  getBy(){
    return this.By;
  }

  getDriver() {
    return this.driver;
  }

  start() {
    const targetURL = this.params.targetURL;
    this.flow(() => {
      if (!targetURL) {
        this.logWarn("Target is required!"); 
        return;
      }
      this.logInfo("Initializing Scrohla ...");
      this.logInfo(`Target url: ${targetURL}`);
    });
    this.goTo(targetURL);
  }

  takeScreenshotBase64(){
    return this.driver.takeScreenshot();
  }

  takeScreenshot() {

    const screenshot = this.config.screenshot;

    if (!screenshot.path) {
      this.logWarn("Couldn't take screenshot :( , Please, check screenshot path config.");
      return;
    }

    this.driver.takeScreenshot().then((data) => {
      const path = screenshot.path + "/" + new Date().getTime() + "_" + screenshot.name;
      fs.writeFile(path, data.replace(/^data:image\/png;base64,/, ""), "base64", (err) => {
        if (err) throw err;
        logger.info("Screenshot saved in: " + path);
      });
    });

  }

}

module.exports.Scrohla = Scrohla;