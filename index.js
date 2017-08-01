const { Core } = require('./src/core');
const logger = require('winston');
    
const core = new Core({
  browser: "chrome",
  args: [ 
    "--start-maximized",
    "--hide-scrollbars",
    "--headless",
    "--disable-gpu"
  ],
  target: "http://www.globo.com",
  screenshotPath: "/home/emerson/Downloads"
});

core.takeScreenshot();

setTimeout(() => {
  logger.info("time out!");
  core.quit(); 
},50000);