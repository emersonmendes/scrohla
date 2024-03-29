"use strict";

const config = require("../../config-app.json");
const logger = require("../logger");

let params;

const buildUserAgent = function(){
    let userAgent = config.browser.userAgent;
    const custom = params.custom;
    if (custom && custom.userAgent) {
        userAgent = custom.userAgent;
        logger.warn("Using custom useragent: ", userAgent);
    }
    return userAgent;
}

const configure = function(webdriver, browser) {

    const builder = new webdriver.Builder();

    
    const binary = "brave" === browser ? "/usr/bin/brave-browser" : "";

    let args = config.browser.chrome.args;
    args.push(`--user-agent='${buildUserAgent()}'`);
    args.push("--disable-blink-features=AutomationControlled");

    if (params.args) {
        args = args.concat(params.args);
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

    logger.info(`${browser} binary: ${binary}`);

    builder.withCapabilities({
        browserName : "chrome",
        chromeOptions: {
            args: args,
            w3c : false,
            binary: binary,
            excludeSwitches: ['enable-automation'],
            useAutomationExtension: false
        },
        'permissions.default.camera': 1
    });

    return builder.build();
    
}

const setParams = function(_params){
    params = _params;
}

module.exports = {
    configure: configure,
    setParams: setParams
};
