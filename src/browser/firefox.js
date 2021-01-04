"use strict";

const config = require("../../config-app.json");
const firefox = require("selenium-webdriver/firefox");
const logger = require("../logger");

const binary = "/usr/bin/firefox";

const configure = function(webdriver) {

    const builder = new webdriver.Builder();

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

    return builder.build();
    
};

module.exports = {
    configure: configure,
    setParams: () => {}
};
