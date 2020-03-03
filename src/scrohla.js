"use strict";

const fs = require("fs");
const logger = require("./logger");
const { Core } = require("./core");
const { CookieManager } = require("./cookie-manager");

const defaultTimeout = 15000;

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

    async logInfo(text) {
        await this.flow(() => logger.info(text));
    }

    async logWarn(text) {
        await this.flow(() => logger.warn(text));
    }

    async doLogin(user, pass) {
        await this.type(user.data, user.xpath);
        await this.type(pass.data, pass.xpath);
        await this.submit(pass.xpath + "//ancestor::form");
    }

    async authenticate(dto) {

        if(dto.loginURL){
            await this.goTo(dto.loginURL);
        }

        dto.beforeLogin && this.flow(dto.beforeLogin);
        const cookies = `${this.params.targetName}-${dto.user.data}`;
        const cookieManager = new CookieManager(cookies, this.getDriver());

        if (dto.cookies && cookieManager.exists()) {
            await this.logInfo(`Using cookies: ${cookies}`);
            await this.flow(() => cookieManager.inject(() => this.reload()));
            await this.sleep(3000);
        } else {
            await this.logInfo("Doing login ...");
            await this.doLogin(dto.user, dto.pass);
            await this.sleep(3000);
            await this.flow(() => cookieManager.store());
        }

    }

    /**
     * Envia texto para um elemento de input
     * @param {string} text 
     * @param {string} xpath 
     */
    async type(text, xpath) {
        await this.waitForVisible(xpath);
        const element = await this.findElement(xpath);
        await element.sendKeys(text);
    }

    submit(xpath) {
        this.waitForLocated(xpath).then(elm => elm.submit());
    }

    async click(xpath, required = true) {
        await this.waitForVisible(xpath);
        await this.findElement(xpath)
            .then(elm => elm.click())
            .catch(() => {
                if (required) {
                    throw Error(`Não conseguiu achar o xpath: ${xpath}`);
                }
            });
    }

    async goTo(url) {
        await this.logInfo(`Going to ${url}`);
        return await this.getDriver().get(url);
    }

    scrollToPageBottom() {
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
        return this.getDriver().findElements(this.By.xpath(xpath));
    }

    async findElement(arg, xpath) {
        if (!xpath) {
            return await this.getDriver().findElement(this.By.xpath(arg));
        }
        return await arg.findElement(this.By.xpath(xpath));
    }

    promiseAll(promises) {
        return this.getWebdriver().promise.all(promises);
    }

    getWebdriver() {
        return this.webdriver;
    }

    /**
     * Pega o atributo de um elemento
     * @param {string} xpath 
     * @param {string} attrib 
     * @param {number} time 
     */
    getAttrib(xpath, attrib, time = defaultTimeout) {
        return this.waitForLocated(xpath, time).then(elm => elm.getAttribute(attrib));
    }

    /**
     * Aguarda e retorna o elemento quando encontrado no dom
     */
    async waitForLocated(xpath, time = defaultTimeout) {
        const element = await this.until().elementLocated(this.By.xpath(xpath));
        return await this.getDriver().wait(element, time);
    }

    /**
     * Aguarda e retorna o elemento quando visível no dom
     * @param { string } xpath 
     * @param { number } time 
     */
    async waitForVisible(xpath, time = defaultTimeout) {
        const element = await this.findElement(xpath);
        return await this.getDriver().wait(this.until().elementIsVisible(element), time);
    }

    /**
     * Aguarda e retorna o elemento quando não mais visível no dom
     * @param { string } xpath 
     * @param { number } time 
     */
    async waitForNotVisible(xpath, time = defaultTimeout) {
        const element = await this.findElement(xpath);
        return await this.getDriver().wait(this.until().elementIsNotVisible(element), time);
    }

    isElementLocated(xpath, time = defaultTimeout) {
        return this.waitForLocated(xpath, time)
            .then(() => true)
            .catch(() => false);
    }

    isElementVisible(xpath, time = defaultTimeout) {
        return this.waitForVisible(xpath, time)
            .then(() => true)
            .catch(() => false);
    }

    isElementNotVisible(xpath, time = defaultTimeout) {
        return this.waitForNotVisible(xpath, time)
            .then(() => true)
            .catch(() => false);
    }

    /**
     * Pega a url corrente
     */
    getCurrentURL() {
        return this.getDriver().getCurrentUrl();
    }

    until() {
        return this.webdriver.until;
    }

    async flow(callback) {
        return await this.controlFlow.execute(callback);
    }

    async quit() {
        return await this.getDriver().quit();
    }

    /** 
     * Why not: this.getDriver().manage().timeouts().pageLoadTimeout(500000) ?
    */
    waitForDocumentReady() {
        return this.getDriver().wait(() => this.executeJs("return document.readyState === 'complete'"));
    }

    /**
     * Execute javascript no browser
     * @param {(function|string)} script - JavaScript a ser executado no browser
     * @param {*} args 
     */
    executeJs(script, args) {
        return this.getDriver().executeScript(script, args);
    }

    async mouseMoveTo(xpath) {
        await this.getDriver().actions().mouseMove(this.waitForLocated(xpath)).perform();
    }

    async reload() {
        await this.logInfo("Reloading ...");
        await this.getDriver().navigate().refresh();
    }

    async sleep(ms = 10000) {
        await this.logInfo(`Sleeping - ${ms / 1000} seconds`);
        return await this.getDriver().sleep(ms);
    }

    getKey() {
        return this.Key;
    }

    getBy() {
        return this.By;
    }

    getDriver() {
        return this.driver;
    }

    async start() {
        const targetURL = this.params.targetURL;
        if (!targetURL) {
            this.logWarn("Target is required!");
            return;
        }
        await this.logInfo("Initializing Scrohla ...");
        await this.logInfo(`Target url: ${targetURL}`);
        await this.goTo(targetURL);
    }

    takeScreenshotBase64() {
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
