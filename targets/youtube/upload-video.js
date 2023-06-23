"use strict";

const logger = require("../../src/logger");

let _scrohla;

const target = {
    url : "https://studio.youtube.com/?approve_browser_access=true",
    loginURL : "https://accounts.google.com/",
    custom : {
        //userAgent : "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3"
    },
    cookies : true,
    execute : collect
};

const authData = {
    loginURL: target.loginURL,
    credentialsName: 'youtube',
    user :{ 
        xpath : "//input[@type='email']"
    },
    pass : { 
        xpath : "//input[@type='password']"
    },
    cookies : true,
    beforeLogin: async () => {
        await _scrohla.waitForLocated("//form");
    },
    afterUsername: async () => {
        await _scrohla.click("//button//span[text()='Next']/..//../button");
        await _scrohla.sleep(5000);
    },
    afterPassword: async () => {
        await _scrohla.click("//button//span[text()='Next']/..//../button");
    }
};

async function collect(scrohla, targetData, sendResult){
    
    _scrohla = scrohla;
    
    let result = {};

    const titleEl = "//div[contains(@class,'title')]//div[@id='textbox']";
    const nextButtonEL = "//*[@id='next-button']";

    await scrohla.authenticate(authData);

    await scrohla.start();

    await scrohla.click("//ytcp-button[@id='create-icon']");

    await scrohla.click("//tp-yt-paper-item[@test-id='upload-beta']");

    await scrohla.waitForLocated("//input[@type='file']");
    const element = await scrohla.findElement("//input[@type='file']");
    await element.sendKeys(targetData.videoPath);   
    
    await scrohla.sleep(2000);

    await scrohla.clear(titleEl);
    await scrohla.sleep(1000);

    await scrohla.type(targetData.videoTitle, titleEl);

    await scrohla.type(targetData.videoDescription, "//div[contains(@class,'description')]//div[@id='textbox']");

    await scrohla.click(nextButtonEL);

    await scrohla.click("//*[@name='VIDEO_MADE_FOR_KIDS_NOT_MFK' and contains(@role,'radio')]");

    await selectPlaylist();
        
    await scrohla.click(nextButtonEL);
    await scrohla.click(nextButtonEL);
    await scrohla.click(nextButtonEL);

    await scrohla.click("//*[@name='PUBLIC' and contains(@role,'radio')]");
    
    await scrohla.sleep(1000 * 60 * 2);

    await sendResult(result);

}    

async function selectPlaylist(){
    
    // const playlistEl = "//*[contains(@class,'playlist')]";
    // try {
    //     await _scrohla.click(`${playlistEl}//span`);
    //     await _scrohla.sleep(2000);
    //     await _scrohla.click(`(${playlistEl}//div[@id='items']//li//label)[1]`);
    //     await _scrohla.sleep(3000);
    //     await _scrohla.waitForVisible("//*[@id='done-button']");
    //     await _scrohla.click("//*[@id='done-button']");
    // } catch(e){
    //     logger.warn('Could not select playlist!');
    // }
}

exports.target = target;
