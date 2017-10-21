"use strict";

const { CookieManager } = require("../src/cookie-manager");
const logger = require("winston");

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

    let result = {x:"teste"};

    scrohla.start();

    scrohla.flow( () => {
        if(cookieManager.exists()){
            cookieManager.inject(() => scrohla.reload());
        } else {
            doLogin(scrohla);
            scrohla.waitFor("//*[@class='js logged-in client-root']")
                .then(() => cookieManager.store() );
        }
    });

    scrohla.goTo("https://www.instagram.com/flamengo");

    scrohla.getAttrib("//article//header//*[contains(@href,'followers')]//span","title").then( attrib => {
        result.followers = Number(attrib.replace(new RegExp(",", "g"),""));
    });

    scrohla.click("//article//header//*[contains(@href,'followers')]");

    scrohla.waitFor("//*[@class='_6e4x5']").then(() =>{
        logger.info("Followers encontrados: %s",result.followers);
    });

    for (var index = 0; index < 10; index++) {
        scrohla.executeJs("document.querySelector('._gs38e').scrollBy(0,50000)", "");
        scrohla.sleep(500);
        scrohla.findElements("//*[@class='_ov9ai']//*[@class='_qv64e _gexxb _4tgw8 _njrw0']").then(elements => {
            logger.info("Quantidade de pessoas até o momento: %s",elements.length);
        });
    }

    scrohla.findElements("//*[@class='_ov9ai']//*[@class='_qv64e _gexxb _4tgw8 _njrw0']").then(elements => {
        logger.info("Preparar para seguir %s pessoas",elements.length);
        elements.forEach(element => {
            element.click();
            scrohla.sleep(300);
        });
    });

    scrohla.flow( () => {
        sendResult(result);
    });

    //scrohla.quit();

}    

exports.target = target;