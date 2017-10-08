'use strict';

const logger = require('winston');

const target = {
    url : "https://cadastro.saude.gov.br/cadsusweb/lxxxx",
    key : "",
    execute : collect
};

function collect(scrohla, sendResult){

    let result = {};

    scrohla.start();

    scrohla.waitFor("//iframe[@name='clntcap_frame']");

    scrohla.takeScreenshot();

    scrohla.getText("//div[@class='logo']",30000).then( text => {
        result.text = text;
    });

    scrohla.flow( () => {
        sendResult(result);
    });

    //scrohla.quit();

}    

exports.target = target;