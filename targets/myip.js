"use strict";

const target = {
    url : "https://whatismyip.com.br/",
    execute : collect
};

function collect(scrohla, sendResult){

    scrohla.start();

    let result = {};

    scrohla.waitForDocumentReady();

    scrohla.getText("(//*[@id='content']//table//tr[1]//td[2])[1]").then( ip => {
        result.ip = ip;
    });

    scrohla.getText("(//*[@id='content']//table//tr[3]//td[2])[1]").then( browser => {
        result.browser = browser;
    });

    scrohla.getText("(//*[@id='content']//table//tr[4]//td[2])[1]").then( platform => {
        result.platform = platform;
    });   

    scrohla.getText("(//*[@id='content']//table//tr[6]/td[2])[1]").then( country => {
        result.country = country;
    });  

    scrohla.takeScreenshot();

    scrohla.flow( () => {
        sendResult(result);
    });

}    

exports.target = target;