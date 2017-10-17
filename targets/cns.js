'use strict';

const logger = require('winston');

const target = {
    url : "https://cadastro.saude.gov.br/cadsusweb/login.jsp",
    execute : collect
};

function collect(scrohla, sendResult){

    let result = {};

    scrohla.start();

    scrohla.executeJs(function(){
        document.cookie = "brav=ad; dtPC=-; dtLatC=1;";
        return "Deu certo";
    }).then( text => {
        logger.info(text);
    });

    scrohla.takeScreenshot();

    scrohla.getText("//div[@class='logo']",120000).then( text => {
        result.text = text;
    }).catch(() => {
        scrohla.takeScreenshot();
    });

    scrohla.flow( () => {
        sendResult(result);
    });

    scrohla.quit();

}    

exports.target = target;