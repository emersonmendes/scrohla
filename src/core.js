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

        const builder = new webdriver.Builder();
        const browser = config.browser.name;

        logger.info("Browser:", browser);

        if ("phantom" === browser) {
            this.configurePhantom(builder);
        } else if ("firefox" === browser) {
            this.configureFirefox(builder);
        } else if ("brave" === browser) {
            this.configureChrome(builder, "/usr/bin/brave-browser");
        } else {
            this.configureChrome(builder);
        }

        this.configureDriver();

    }

    configureDriver() {
        const resolution = config.browser.resolution;
        this.driver.manage().window().setRect({ width: resolution.w, height: resolution.h });
        this.driver.manage().window().maximize();
        this.driver.manage().setTimeouts({
            implicit: TIMEOUT, 
            pageLoad: TIMEOUT, 
            script: TIMEOUT
        });
    }

    configureFirefox(builder) {

        const binary = "/usr/bin/firefox";
        const firefox = require("selenium-webdriver/firefox");
        const options = new firefox.Options();
        let args = "";

        for(const arg of config.browser.firefox.args){
            args = args.concat(arg);
        }

        if (config.browser.headless) {
            args = args.concat("-headless");
            logger.info("firefox is in headless mode");
        }

        if(args){
            options.setBinary(binary).addArguments(args);
        } else {
            options.setBinary(binary);
        }

        builder.setFirefoxOptions(options);
        builder.withCapabilities({
            browserName: "firefox",
            acceptSslCerts: true,
            acceptInsecureCerts: true
        });

        this.driver = builder.build();

    }

    configurePhantom(builder) {

        var caps = webdriver.Capabilities.phantomjs();
        caps.set("phantomjs.binary.path", config.browser.phantom.binaryPath);

        let defaultArgs = config.browser.phantom.args;

        caps.set("phantomjs.cli.args", defaultArgs);
        caps.set("phantomjs.page.settings.userAgent", this.buildUserAgent());

        builder.withCapabilities(caps);
        builder.forBrowser("phantomjs");
        this.driver = builder.build();

    }

    configureChrome(builder, binary = "") {

        logger.info(`Chrome binary: ${binary}`);

        let args = config.browser.chrome.args;
        args.push(`--user-agent='${this.buildUserAgent()}'`);

        if (this.params.args) {
            args = args.concat(this.params.args);
        }

        if (config.browser.headless) {
            args.push("--headless");
            args.push("--disable-gpu");
            args.push("--no-sandbox");
            logger.info("Browser is in headless mode");
        }

        const proxy = config.browser.proxy;
        if (proxy.ip && proxy.port) {
            args.push(`--proxy-server=${proxy.ip}:${proxy.port}`);
        }

        builder.withCapabilities({
            browserName : "chrome",
            chromeOptions: {
                args: args,
                w3c : false,
                binary: binary
            }
        });

        this.driver = builder.build();

    }

    buildUserAgent() {
        let userAgent = config.browser.userAgent;
        const custom = this.params.custom;
        if (custom && custom.userAgent) {
            userAgent = custom.userAgent;
            logger.warn("Using custom useragent: ", userAgent);
        }
        return userAgent;
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
