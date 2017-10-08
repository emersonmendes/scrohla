'use strict';

const webdriver = require('selenium-webdriver');
const config = require('../config-app.json');

exports.Core = class {

  constructor(params){
    this.params = params;
    this.configure();
  }

  configure(){

    const builder = new webdriver.Builder();

    if(config.browser.name === "phantom"){
      this.configurePhantom(builder);
    }else {
      this.configureChrome(builder);
    }

  }

  configurePhantom(builder){
    
    var caps = webdriver.Capabilities.phantomjs();
    caps.set("phantomjs.binary.path", config.browser.phantom.binaryPath);

    let defaultArgs = config.browser.phantom.args;

    if(config.browser.ignoreArgs){ 
      defaultArgs = []; 
    }

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
    
    if(config.browser.ignoreArgs){ 
      defaultArgs = []; 
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