"use strict";

const webdriver = require("selenium-webdriver");
const logger = require("./logger");
const config = require("../config-app.json");
class Core {

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
    } else if("firefox" === browser) {
      this.configureFirefox(builder);
    } else {
      this.configureChrome(builder);
    }

    this.configureDriver();
    
  }

  configureDriver(){
    this.driver.manage().window().setSize(
      config.browser.resolution.w, 
      config.browser.resolution.h
    );
    this.driver.manage().window().maximize();
    this.driver.manage().timeouts().pageLoadTimeout(500000);
  }

  configureFirefox(builder){
    
    const firefox = require("selenium-webdriver/firefox");
    
    const options = new firefox.Options();

    const binary = new firefox.Binary(firefox.Channel.NIGHTLY);
    options.setBinary(binary);
    
    if(config.browser.headless){
      binary.addArguments("-headless");
      logger.info("firefox is in headless mode");
    }   
    
    builder.setFirefoxOptions(options);
    builder.withCapabilities({
      "browserName": "firefox", 
      acceptSslCerts: true, 
      acceptInsecureCerts: true
    });

    this.driver = builder.build();

  }

  configurePhantom(builder){
    
    var caps = webdriver.Capabilities.phantomjs();
    caps.set("phantomjs.binary.path", config.browser.phantom.binaryPath);

    let defaultArgs = config.browser.phantom.args;

    caps.set("phantomjs.cli.args", defaultArgs);
    caps.set("phantomjs.page.settings.userAgent", this.mountUSerAgent());
    
    builder.withCapabilities(caps);
    builder.forBrowser("phantomjs");
    this.driver = builder.build();

  }

  configureChrome(builder){

    let args = config.browser.chrome.args;
    args.push(`--user-agent='${this.mountUSerAgent()}'`);

    if(this.params.args){
      args = args.concat(this.params.args);
    }

    if(config.browser.headless){
      args.push("--headless");
      args.push("--disable-gpu");
      args.push("--no-sandbox");
      logger.info("Chrome is in headless mode");
    }

    const proxy = config.browser.proxy;
    if(proxy.ip && proxy.port){
      args.push(`--proxy-server=${proxy.ip}:${proxy.port}`);
    }
    
    builder.withCapabilities({
      "browserName": "chrome", 
      "chromeOptions": { 
        "args": args 
      }
    });

    this.driver = builder.build();
  
  }

  mountUSerAgent(){
    let userAgent = config.browser.userAgent;
    const custom = this.params.custom;
    if(custom && custom.userAgent){
      userAgent = custom.userAgent;
      logger.warn("Using custom useragent: ",userAgent);
    }
    return userAgent;
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

module.exports.Core = Core;