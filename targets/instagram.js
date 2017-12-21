"use strict";

const logger = require("winston");
const credentials = require("./credentials.json").instagram;

const target = {
    url : "https://www.instagram.com/flamengo",
    loginURL : "https://www.instagram.com/accounts/login",
    execute : collect
};

function collect(scrohla, sendResult){

    let result = {};

    scrohla.authenticate({
        loginURL: target.loginURL,
        user :{ 
            xpath : "(//input[ @name='username' ])[1]", 
            data : credentials.user
        },
        pass : { 
            xpath : "(//input[@type='password'])[1]", 
            data : credentials.pass
        }
    });

    scrohla.start();

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

    scrohla.flow( () => sendResult(result));

}    

exports.target = target;