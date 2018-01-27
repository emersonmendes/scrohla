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

    /**
     * require geckodriver assim pois sem isso quando inicia com
     * child process o caminho nao é reconhecido. Verificar melhor no futuro
     */
    require("geckodriver").path;
    
    const firefox = require("selenium-webdriver/firefox");
    builder.forBrowser("firefox");
    const binary = new firefox.Binary(firefox.Channel.NIGHTLY);
    builder.setFirefoxOptions(new firefox.Options().setBinary(binary));
    
    if(config.browser.firefox.headless){
      binary.addArguments("-headless");
      logger.info("firefox is in headless mode");
    }   
   
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

    require("chromedriver").path;
    
    let defaultArgs = config.browser.chrome.args;
    defaultArgs.push(`--user-agent='${this.mountUSerAgent()}'`);

    if(config.browser.chrome.headless){
      defaultArgs.push("--headless");
      defaultArgs.push("--disable-gpu");
      defaultArgs.push("--no-sandbox");
      logger.info("Chrome is in headless mode");
    }
    
    if(this.params.args){
      defaultArgs = defaultArgs.concat(this.params.args);
    }
    
    const caps = webdriver.Capabilities.chrome();
    caps.set("chromeOptions", { "args": defaultArgs });
    builder.withCapabilities(caps);
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