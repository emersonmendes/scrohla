"use strict";

const webdriver = require("selenium-webdriver");
const logger = require("./logger");
const config = require("../config-app.json");
const TIMEOUT = 500000;

class Core {

    constructor(params) {
        this.params = params;
        this.configure();
    }

    configure() {

        const browser = config.browser.name;
        logger.info("Browser:", browser);

        const browserImpl = require(`./browser/${browser}`);
        browserImpl.setParams(this.params);

        this.driver = browserImpl.configure(webdriver, browser);
        const resolution = config.browser.resolution;
        this.driver.executeScript("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        this.driver.manage().window().setRect({ width: resolution.w, height: resolution.h });
        this.driver.manage().window().maximize();
        this.driver.manage().setTimeouts({
            implicit: TIMEOUT, 
            pageLoad: TIMEOUT, 
            script: TIMEOUT
        });

    }

    getWebdriver() {
        return webdriver;
    }

    getDriver() {
        return this.driver;
    }

    getConfig() {
        return config;
    }

}

module.exports.Core = Core;
