"use strict";

const logger = require("../../src/logger");

let _scrohla;

const target = {
    url : "https://www.tiktok.com/",
    loginURL : "https://www.tiktok.com/login/phone-or-email/email",
    custom : {
        //userAgent : "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3"
    },
    execute : collect
};

const authData = {
    loginURL: target.loginURL,
    credentialsName: 'tiktok',
    user :{ 
        xpath : "//input[@name='username']"
    },
    pass : { 
        xpath : "//input[@type='password']"
    },
    cookies : true,
    beforeLogin: async () => {
        await _scrohla.isElementVisible("//form");
    }
};

async function collect(scrohla, targetData, sendResult){
    
    _scrohla = scrohla;

    await scrohla.authenticate(authData);

    await scrohla.start();

    await scrohla.click("//a[@aria-label='Upload a video']");

    await scrohla.switchToIframe("//iframe");

    const element = await scrohla.findElement("//input[@type='file']");
    await element.sendKeys(targetData.videoPath);

    await scrohla.waitForLocated("//div[contains(@class,'video-player-control')]");
    await scrohla.sleep(3000);


    
    scrohla.executeJs('document.querySelectorAll("span[data-text=true]")[0].innerText = ""');
    await scrohla.sleep(3000);

    const captionInput = "//div[contains(@class,'caption')]//span[@data-text='true']";

    const hashtags = targetData.hashtags.join(" ");
    const description = `${targetData.videoDescription}\n\n${hashtags}`;
    
    await scrohla.type(description, captionInput);

    await scrohla.sleep(2000);
    
    const esc = await scrohla.getKey('ESCAPE');
    const del = await scrohla.getKey('DELETE');
    await scrohla.type(del, captionInput);
    await scrohla.type(del, captionInput);
    await scrohla.type(del, captionInput);
    await scrohla.type(del, captionInput);
    await scrohla.type(del, captionInput);
    
    await scrohla.sleep(1000);
    await scrohla.type(esc, captionInput);
    await scrohla.sleep(1000);

    await scrohla.scrollToPageBottom();

    await scrohla.click("//*[contains(@class,'switch-text')]/..//input");
    await scrohla.sleep(1000);

    await scrohla.click("//div[contains(@class,'btn-post')]//button");
    await scrohla.sleep(5000);

    await scrohla.waitForLocated("//div[text()='View profile']");

    await sendResult({
        result: 'success'
    });

}    

exports.target = target;
