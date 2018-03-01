"use strict";

const logger = require("../src/logger");
const credentials = require("./credentials.json").instagram;

const target = {
    url : "https://www.instagram.com/fl0ripamilgrau/",
    loginURL : "https://www.instagram.com/accounts/login",
    custom : {
        userAgent : "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3"
    },
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
        },
        cookies : true
    });

    scrohla.start();

    scrohla.getAttrib("//article//header//*[contains(@href,'followers')]//span","title").then( attrib => {
        result.followers = Number(attrib.replace(new RegExp(",", "g"),""));
    });

    scrohla.click("//article//header//*[contains(@href,'followers')]");

    scrohla.waitForLocated("//*[@class='_6e4x5']").then(() => {
        logger.info("Followers encontrados: %s",result.followers);
    });

    for (var index = 0; index < 150; index++) {
        scrohla.executeJs("document.querySelector('._gs38e').scrollBy(0,50000)", "");
        scrohla.sleep(2000);
        scrohla.findElements("//*[@class='_ov9ai']//*[@class='_qv64e _gexxb _4tgw8 _njrw0']").then(elements => {
            logger.info("Quantidade de pessoas até o momento: %s",elements.length);
        });
    }

    let qt = 0;
    let qtClicked = 0;

    scrohla.findElements("//*[@class='_ov9ai']//*[@class='_qv64e _gexxb _4tgw8 _njrw0']").then(elements => {
        logger.info("Preparar para seguir %s pessoas",elements.length);
        elements.forEach(element => {
            element.click().then(() => qtClicked++);
            qt++;
            if(qt > 25){
                scrohla.flow( () => logger.info("Clicou %s vezes",qtClicked) );
                scrohla.sleep(60000 * 5);
                qt = 0;
            } else {
                scrohla.sleep(300);
            }
        });
    });

    scrohla.flow( () => sendResult(result));

}    

exports.target = target;