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
        this.config = core.getConfig();
        this.By = this.webdriver.By;
        this.Key = this.webdriver.Key;
    }

    logInfo(text) {
        logger.info(text);
    }

    logWarn(text) {
        logger.warn(text);
    }

    async doLogin(dto, credential) {
        await this.type(credential.user, dto.user.xpath);
        await this.type(credential.pass, dto.pass.xpath);
        await this.submit(`${dto.pass.xpath}//ancestor::form`);
    }

    async authenticate(dto) {

        if(dto.loginURL){
            await this.goTo(dto.loginURL);
        }

        const credentialsFile = "../targets/credentials.json";
        let credential;

        try {
            credential = require(credentialsFile)[dto.credentialsName];
        } catch(err){
            if(err.message && err.message.includes('Cannot find module')){
                logger.error(`Arquivo ${credentialsFile} não foi encontrado!\n\nCrie o arquivo com conteúdo ex: \n${JSON.stringify({"linkedin":{"user":"username","pass":"123"}}, null, 4)}`);
            } else {
                logger.error(err);
            }
        }

        dto.beforeLogin && dto.beforeLogin();
        const cookies = `${this.params.targetName}-${credential.user}`;
        const cookieManager = new CookieManager(cookies, this.getDriver());

        if (dto.cookies && cookieManager.exists()) {
            this.logInfo(`Using cookies: ${cookies}`);
            await cookieManager.inject(() => this.reload());
            await this.sleep(3000);
        } else {
            this.logInfo("Doing login ...");
            await this.doLogin(dto, credential);
            await this.sleep(3000);
            await cookieManager.store();
        }

    }

    /**
     * Envia texto para um elemento de input
     * @param {string} text 
     * @param {string} xpath 
     */
    async type(text, xpath) {
        this.logInfo(`Typing text "${text}" at ${xpath}`);
        await this.waitForVisible(xpath);
        const element = await this.findElement(xpath);
        await element.sendKeys(text);
    }

    async submit(xpath) {
        const element = await this.waitForLocated(xpath);
        element.submit();
    }

    async click(xpath, required = true) {

        this.logInfo(`clicking at ${xpath}`);
        
        await this.waitForVisible(xpath);
        
        try {
            const element = await this.findElement(xpath);
            await element.click();
        } catch (err){
            if (required) {
                throw Error(`Não conseguiu achar o xpath: ${xpath}`);
            }
        }
            
    }

    async goTo(url) {
        await this.logInfo(`Going to ${url}`);
        return await this.getDriver().get(url);
    }

    async scrollToPageBottom() {
        return await this.executeJs("window.scrollTo(0,document.body.scrollHeight);", "");
    }

    /**
     * Pega o texto de um elemento
     * @param {string} xpath 
     * @param {number} time 
     */
    async getText(xpath, time) {
        const element = await this.waitForLocated(xpath, time);
        return element.getText();
    }

    async findElements(xpath) {
        return await this.getDriver().findElements(this.By.xpath(xpath));
    }

    async findElement(arg, xpath) {
        if (!xpath) {
            return await this.getDriver().findElement(this.By.xpath(arg));
        }
        return await arg.findElement(this.By.xpath(xpath));
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
    async getAttrib(xpath, attrib, time = defaultTimeout) {
        const element = await this.waitForLocated(xpath, time);
        return element.getAttribute(attrib);
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

    async isElementLocated(xpath, time = defaultTimeout) {
        try {
            await this.waitForLocated(xpath, time);
            return true;
        } catch(err){
            return false;
        }
    }

    async isElementVisible(xpath, time = defaultTimeout) {
        try {
            await this.waitForVisible(xpath, time);
            return true;
        } catch(err){
            return false;
        }
    }

    async isElementNotVisible(xpath, time = defaultTimeout) {
        try {
            await this.waitForNotVisible(xpath, time);
            return true;
        } catch(err){
            return false;
        }
    }

    until() {
        return this.webdriver.until;
    }

    flow(callback) {
        logger.warn('"this.webdriver.promise.controlFlow()" was removed from Selenium 4, please dont use this method!');
        callback && callback();
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
    async executeJs(script, args) {
        return await this.getDriver().executeScript(script, args);
    }

    async mouseMoveTo(xpath) {
        const element = await this.waitForLocated(xpath);
        await this.getDriver().actions().move({ oringin: element }).perform();
    }

    async reload() {
        this.logInfo("Reloading ...");
        await this.getDriver().navigate().refresh();
    }

    async sleep(ms = 10000) {
        this.logInfo(`Sleeping - ${ms / 1000} seconds`);
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

    async takeScreenshot() {

        const screenshot = this.config.screenshot;

        if (!screenshot.path) {
            this.logWarn("Couldn't take screenshot :( , Please, check screenshot path config.");
            return;
        }

        const data = await this.driver.takeScreenshot();
        const path = screenshot.path + "/" + new Date().getTime() + "_" + screenshot.name;
        fs.writeFile(path, data.replace(/^data:image\/png;base64,/, ""), "base64", (err) => {
            if (err) throw err;
            logger.info("Screenshot saved in: " + path);
        });

    }

}

module.exports.Scrohla = Scrohla;
