'use strict';

const webdriver = require('selenium-webdriver');
const logger = require('winston');
const config = require('../config-app.json');

exports.Core = class {

  constructor(params){
    this.params = params;
    this.configure();
  }

  configure(){

    const builder = new webdriver.Builder();
    const browser = config.browser.name;

    logger.info("Browser:",browser);

    if("phantom" === browser){
      this.configurePhantom(builder);
    }else {
      this.configureChrome(builder);
    }

  }

  configurePhantom(builder){
    
    var caps = webdriver.Capabilities.phantomjs();
    caps.set("phantomjs.binary.path", config.browser.phantom.binaryPath);

    let defaultArgs = config.browser.phantom.args;

    caps.set("phantomjs.cli.args", defaultArgs);
    caps.set("phantomjs.page.settings.userAgent", config.browser.userAgent);
    
    builder.withCapabilities(caps);
    builder.forBrowser('phantomjs')
    this.driver = builder.build();

  }

  configureChrome(builder){

    const chrome = require('selenium-webdriver/chrome');
    chrome.setDefaultService(new chrome.ServiceBuilder(require('chromedriver').path).build());
    
    let defaultArgs = config.browser.chrome.args;
    defaultArgs.push("--user-agent='" + config.browser.userAgent + "'");

    if(config.browser.chrome.headless){
      
      defaultArgs.push("--headless");
      defaultArgs.push("--disable-gpu");
      //defaultArgs.push("--remote-debugging-port=9222");
      defaultArgs.push("--no-sandbox");

      logger.info("chrome is in headless mode. args:");
      logger.info(defaultArgs);

    }
    
    if(this.params.args){
      defaultArgs = defaultArgs.concat(this.params.args);
    }
    
    const caps = webdriver.Capabilities.chrome();
    caps.set('chromeOptions', { "args": defaultArgs });
    builder.withCapabilities(caps);
    this.driver = builder.build();
  
  }

  getWebdriver(){
    return webdriver;
  }

  getDriver(){
    return this.driver;
  }

  getConfig(){
    return config;
  }

}