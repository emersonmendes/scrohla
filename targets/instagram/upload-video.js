"use strict";

const logger = require("../../src/logger");

let _scrohla;

const target = {
    url : "https://www.instagram.com/",
    loginURL : "https://www.instagram.com/accounts/login",
    custom : {
        //userAgent : "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3"
    },
    execute : collect
};

const authData = {
    loginURL: target.loginURL,
    credentialsName: 'instagram',
    user: { 
        xpath: "(//input[@name='username'])[1]"
    },
    pass: { 
        xpath: "(//input[@type='password'])[1]"
    },
    cookies: false,
    beforeLogin: async () => {
        await _scrohla.waitForLocated("//form");
    }
};

async function collect(scrohla, targetData, sendResult){
    
    _scrohla = scrohla;
    
    let result = {};

    await scrohla.authenticate(authData);

    await scrohla.start();

    await scrohla.click('//*[@aria-label="New post"]');

    await scrohla.waitForLocated("//input[@type='file']");

    const element = await scrohla.findElement("//input[ @type='file' and contains(@accept,'video') ]");
    await element.sendKeys(targetData.videoPath);

    await scrohla.click("//button[text()='OK']");
    await scrohla.click("//*[@aria-label='Select crop']//..//..//..//button");
    await scrohla.click("(//*[contains(@aria-label,'Photo')]//..//../div)[1]");

    await scrohla.click("//*[text()='Next']");
    await scrohla.click("//*[text()='Next']");

    const hashtags = targetData.hashtags.join(" ");
    const description = `${targetData.videoDescription}\n\n${hashtags}`;
    await scrohla.type(description, "//div[@role='textbox']");
    
    await scrohla.click("//*[text()='Share']");

    await scrohla.sleep(1000 * 60 * 5);

    await sendResult(result);

}    

exports.target = target;
