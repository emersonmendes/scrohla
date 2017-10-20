"use strict";

const { CookieManager } = require("../src/cookie-manager");

const target = {
    url : "https://www.instagram.com/",
    username : "cruliano.silva@mail.com",
    pass : "crulianosilva2017",
    execute : collect
};

function doLogin(scrohla){
    
    scrohla.click("//*[@class='_b93kq']");
    
    scrohla.type(target.username, "//*[@class='_ph6vk _o716c']");
    scrohla.type(target.pass, "//*[@type='password']");

    scrohla.click("//button");

}

function collect(scrohla, sendResult){

    const cookieManager = new CookieManager(
        target.username,
        scrohla.getDriver()
    );

    let result = {};

    scrohla.start();

    scrohla.flow( () => {
        cookieManager.hasCookies(has => {
            if(has){
                cookieManager.inject();
            } else {
                doLogin(scrohla);
                scrohla.waitFor("//*[@class='js logged-in client-root']").then(() => cookieManager.store() );
            }
        });
    });

    scrohla.flow( () => {
        sendResult(result);
    });

    //scrohla.quit();

}    

exports.target = target;