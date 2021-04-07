"use strict";

const logger = require("../../src/logger");

let _scrohla;

const target = {
    url : "https://www.instagram.com/floripamilgrau/",
    loginURL : "https://www.instagram.com/accounts/login",
    custom : {
        //userAgent : "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3"
    },
    execute : collect
};

const authData = {
    loginURL: target.loginURL,
    credentialsName: 'instagram',
    user :{ 
        xpath : "(//input[@name='username'])[1]"
    },
    pass : { 
        xpath : "(//input[@type='password'])[1]"
    },
    cookies : false,
    beforeLogin: async () => {
        await _scrohla.waitForLocated("//form");
    }
};

async function collect(scrohla, sendResult){
    
    _scrohla = scrohla;
    
    let result = {};

    await scrohla.authenticate(authData);

    await scrohla.start();

    await scrohla.click('//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a');

    await scrohla.waitForLocated("//*[@class='isgrP']");

    for (let index = 0; index < 5; index++) {
        await scrohla.executeJs("document.querySelector('.isgrP').scrollBy(0,50000)", "");
        await scrohla.sleep(2000);
        const elements = await scrohla.findElements("//*[@class='jSC57  _6xe7A']//*[@class='wo9IH']");
        logger.info(`Loop ${index}. Quantidade de pessoas até o momento: ${elements.length}`);
    }

    let qt = 0;
    let qtClicked = 0;

    const elements = await scrohla.findElements("//*[@class='jSC57  _6xe7A']//*[@class='sqdOP  L3NKy   y3zKF     ']");
    logger.info("Preparar para seguir %s pessoas",elements.length);

    for (const element of elements) {
        await element.click();
        qtClicked++
        qt++;
        if(qt > 25){
            logger.info("Clicou %s vezes",qtClicked);
            await scrohla.sleep(60000 * 5);
            qt = 0;
        } else {
            await scrohla.sleep(300);
        }
    }

    result.qtClicked = qtClicked;

    await sendResult(result);

}    

exports.target = target;
