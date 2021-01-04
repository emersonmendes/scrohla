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

const configure = function(webdriver) {

    const builder = new webdriver.Builder();

    var caps = webdriver.Capabilities.phantomjs();
    caps.set("phantomjs.binary.path", config.browser.phantom.binaryPath);

    let defaultArgs = config.browser.phantom.args;

    caps.set("phantomjs.cli.args", defaultArgs);
    caps.set("phantomjs.page.settings.userAgent", buildUserAgent());

    builder.withCapabilities(caps);
    builder.forBrowser("phantomjs");
    
    return builder.build();

}

const setParams = function(_params){
    params = _params;
}

module.exports = {
    configure: configure,
    setParams: setParams
};
